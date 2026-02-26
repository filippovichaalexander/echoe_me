"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import AvatarChatSidebar from "@/app/components/AvatarChatSidebar";
import ProjectDirSidebar from "@/app/components/ProjectDirSidebar";
import { useLibraryProjects } from "@/lib/hooks/useLibraryProjects";
import type { LibraryProject } from "@/lib/api/types";
import { apiClient } from "@/lib/api/client";

import { TYPE_OPTIONS, STEPS, DESCRIPTION_MAX_LENGTH, RECORDING_MIN_SEC } from "./constants";
import { toWizardProject } from "./types";
import { validateProjectName } from "./validation";
import { useWizardData } from "./useWizardData";
import { useVoiceRecording } from "./useVoiceRecording";
import { WizardProjectModal } from "./components/WizardProjectModal";
import { WizardChooseProject } from "./components/WizardChooseProject";
import { WizardStepDescription } from "./steps/WizardStepDescription";
import { WizardStepRefs } from "./steps/WizardStepRefs";
import { WizardStepTech } from "./steps/WizardStepTech";
import { WizardStepInstruments } from "./steps/WizardStepInstruments";
import { WizardStepStructure } from "./steps/WizardStepStructure";
import { WizardStepContext } from "./steps/WizardStepContext";
import { WizardStepExtra } from "./steps/WizardStepExtra";

export default function WizardPage() {
  const { projects, loading: projectsLoading, error: projectsError, createProject, refresh: refreshProjects } = useLibraryProjects();
  const [projectChoice, setProjectChoice] = useState<null | "create" | "choose">(null);
  const [projectName, setProjectName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<ReturnType<typeof toWizardProject> | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [refsLinkInput, setRefsLinkInput] = useState("");
  const [refsLinkError, setRefsLinkError] = useState<string | null>(null);
  const [refsFiles, setRefsFiles] = useState<{ id: string; name: string; size: number; path?: string }[]>([]);
  const [refsFileError, setRefsFileError] = useState<string | null>(null);
  const [refsUploading, setRefsUploading] = useState(false);
  const refsFileInputRef = useRef<HTMLInputElement | null>(null);
  const [extraTextFiles, setExtraTextFiles] = useState<{ id: string; name: string; size: number; path?: string }[]>([]);
  const [extraTextFileError, setExtraTextFileError] = useState<string | null>(null);
  const [extraTextUploading, setExtraTextUploading] = useState(false);
  const extraTextFileInputRef = useRef<HTMLInputElement | null>(null);

  const { data, setData, getSet, getList, toggleList, setValue } = useWizardData();
  const voice = useVoiceRecording({
    currentProject,
    step,
    dataDescription: (data.description as string) ?? "",
    setValue,
  });
  const extraVoiceProject = currentProject ? { ...currentProject, id: `${currentProject.id}__extra` } : null;
  const voiceExtra = useVoiceRecording({
    currentProject: extraVoiceProject,
    step,
    dataDescription: (getSet("extra", "text") as string) ?? "",
    setValue,
  });

  useEffect(() => {
    if (projectChoice === "choose") refreshProjects();
  }, [projectChoice, refreshProjects]);

  const wizardSteps = selectedType === "Полная композиция" ? STEPS : STEPS.filter((s) => s.id !== "structure");
  const current = wizardSteps[step];
  const isLast = step === wizardSteps.length - 1;
  const hasDescription = ((data.description as string) ?? "").trim().length > 0;
  const hasAudio = !!voice.getBlobToUpload();
  const isStep2GenerateDisabled =
    current?.id === "description" &&
    ((!hasDescription && !hasAudio) ||
      voice.voiceUploading ||
      voice.isRecordingVoice ||
      (hasAudio && !!voice.voiceDurationError));

  const handleCreateProject = useCallback(async () => {
    setCreateError(null);
    const err = validateProjectName(projectName);
    if (err) {
      setCreateError(err);
      return;
    }
    try {
      const created = await createProject(projectName.trim());
      setCurrentProject(toWizardProject(created));
      setProjectChoice("create");
    } catch (e) {
      setCreateError(e instanceof Error ? e.message : "Ошибка создания проекта");
    }
  }, [projectName, createProject]);

  const handleChooseProject = useCallback((project: LibraryProject) => {
    setCurrentProject(toWizardProject(project));
    setProjectChoice("create");
    setSelectedType(null);
    setStep(0);
  }, []);

  const handleBackStep = useCallback(() => {
    if (step === 0) setSelectedType(null);
    else setStep(step - 1);
  }, [step]);

  const handleStepNext = useCallback(async () => {
    const isDescriptionStep = current?.id === "description";
    const blobToUpload = voice.getBlobToUpload();
    if (isDescriptionStep && blobToUpload && currentProject && selectedType) {
      if (voice.voiceRecordingPaused && voice.getTotalDurationMs() < RECORDING_MIN_SEC * 1000) {
        voice.setVoiceError(`Минимум ${RECORDING_MIN_SEC} сек записи. Запишите дольше или удалите запись.`);
        return;
      }
      voice.setVoiceUploading(true);
      try {
        await apiClient.uploadVoiceDescription("/api/avatar/voice-description", blobToUpload, {
          projectId: currentProject.id,
          creationType: selectedType,
          transcription: undefined,
        });
        voice.setVoiceError(null);
        voice.onUploadSuccess(blobToUpload);
        setStep((s) => s + 1);
      } catch (e) {
        voice.setVoiceError(e instanceof Error ? e.message : "Ошибка отправки записи");
      } finally {
        voice.setVoiceUploading(false);
      }
      return;
    }
    if (isDescriptionStep && !blobToUpload) {
      setStep((s) => s + 1);
      return;
    }
    if (step + 1 < wizardSteps.length) setStep((s) => s + 1);
    else {
      /* TODO: submit */
    }
  }, [current, voice.getBlobToUpload, currentProject, selectedType, step, wizardSteps.length, voice]);

  const handleSkipStep = useCallback(() => {
    if (!current) return;
    if (current.id === "description") {
      // TODO: trigger immediate generation without going through the remaining steps
      return;
    }
    setStep((s) => (s + 1 < wizardSteps.length ? s + 1 : s));
  }, [current, wizardSteps.length]);

  const uploadRefFile = useCallback(async (file: File) => {
    setRefsUploading(true);
    try {
      const res = await apiClient.uploadFile<{ id: string; name: string; size: number; path: string }>("/api/library/upload/ref-audio", file);
      setRefsFiles((prev) => [...prev, { id: res.id, name: res.name, size: res.size, path: res.path }]);
    } catch (err) {
      setRefsFileError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setRefsUploading(false);
    }
  }, []);

  const uploadExtraTextFile = useCallback(async (file: File) => {
    setExtraTextUploading(true);
    try {
      const res = await apiClient.uploadFile<{ id: string; name: string; size: number; path: string }>("/api/library/upload/ref-text", file);
      setExtraTextFiles((prev) => [...prev, { id: res.id, name: res.name, size: res.size, path: res.path }]);
    } catch (err) {
      setExtraTextFileError(err instanceof Error ? err.message : "Ошибка загрузки");
    } finally {
      setExtraTextUploading(false);
    }
  }, []);

  const showMainLayout = projectChoice === "create" && currentProject;

  const renderStepContent = () => {
    if (!current) return null;
    if (current.id === "description") {
      return (
        <WizardStepDescription
          descriptionValue={(data.description as string) ?? ""}
          onDescriptionChange={(v) => setValue("description", v)}
          onStepNext={handleStepNext}
          voice={{
            isRecordingVoice: voice.isRecordingVoice,
            voiceRecordingPaused: voice.voiceRecordingPaused,
            voiceDurationError: voice.voiceDurationError,
            voiceFinalDurationSec: voice.voiceFinalDurationSec,
            voicePausedDurationMs: voice.voicePausedDurationMs,
            voiceError: voice.voiceError,
            voiceUploading: voice.voiceUploading,
            voiceDraftBlob: voice.voiceDraftBlob,
            voiceDraftPlaying: voice.voiceDraftPlaying,
            setVoiceDraftPlaying: voice.setVoiceDraftPlaying,
            voiceFinalBlob: voice.voiceFinalBlob,
            voiceDraftUrl: voice.voiceDraftUrl,
            voiceFinalUrl: voice.voiceFinalUrl,
            voiceDraftAudioRef: voice.voiceDraftAudioRef,
            startVoiceRecording: voice.startVoiceRecording,
            pauseVoiceRecording: voice.pauseVoiceRecording,
            cancelPausedRecording: voice.cancelPausedRecording,
            playPausedChunks: voice.playPausedChunks,
            continueFromDraft: voice.continueFromDraft,
            voiceDraftPlayPause: voice.voiceDraftPlayPause,
            voiceFinalRemove: voice.voiceFinalRemove,
            clearDraftAndChunks: voice.clearDraftAndChunks,
          }}
        />
      );
    }
    if (current.id === "refs") {
      return (
        <WizardStepRefs
          refsLinkInput={refsLinkInput}
          setRefsLinkInput={setRefsLinkInput}
          refsLinkError={refsLinkError}
          setRefsLinkError={setRefsLinkError}
          refsFiles={refsFiles}
          setRefsFiles={setRefsFiles}
          refsFileError={refsFileError}
          setRefsFileError={setRefsFileError}
          refsUploading={refsUploading}
          refsFileInputRef={refsFileInputRef}
          getList={getList}
          setData={setData}
          toggleList={toggleList}
          onUploadRefFile={uploadRefFile}
        />
      );
    }
    if (current.id === "tech") return <WizardStepTech getSet={getSet} setValue={setValue} />;
    if (current.id === "instruments") return <WizardStepInstruments getList={getList} toggleList={toggleList} />;
    if (current.id === "structure") return <WizardStepStructure getSet={getSet} getList={getList} setValue={setValue} toggleList={toggleList} />;
    if (current.id === "context") return <WizardStepContext getList={getList} getSet={getSet} toggleList={toggleList} setValue={setValue} />;
    if (current.id === "extra") {
      return (
        <WizardStepExtra
          getSet={getSet}
          setValue={setValue}
          getList={getList}
          toggleList={toggleList}
          voice={voiceExtra}
          extraTextFiles={extraTextFiles}
          setExtraTextFiles={setExtraTextFiles}
          extraTextFileError={extraTextFileError}
          setExtraTextFileError={setExtraTextFileError}
          extraTextUploading={extraTextUploading}
          extraTextFileInputRef={extraTextFileInputRef}
          onUploadTextFile={uploadExtraTextFile}
        />
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col">
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur shrink-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Пошаговый конструктор</h1>
          <Link href="/create" className="text-sm text-gray-400 hover:text-white transition">
            ← Назад
          </Link>
        </div>
      </header>

      {projectChoice === null && (
        <WizardProjectModal
          projectName={projectName}
          setProjectName={setProjectName}
          createError={createError}
          setCreateError={setCreateError}
          onCreate={handleCreateProject}
          onChooseExisting={() => setProjectChoice("choose")}
        />
      )}

      {projectChoice === "choose" && (
        <WizardChooseProject
          projects={projects}
          loading={projectsLoading}
          error={projectsError}
          onSelect={handleChooseProject}
          onCreateNew={() => {
            setProjectChoice(null);
            setProjectName("");
            setCreateError(null);
          }}
        />
      )}

      {showMainLayout && currentProject && (
        <div className="flex-1 flex flex-row min-h-0">
          <ProjectDirSidebar projectName={currentProject.name} projectId={currentProject.id} files={currentProject.files} />
          <div className="flex-1 flex flex-col md:flex-row min-h-0 min-w-0">
            <main className="flex-1 min-w-0 overflow-auto">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl w-full space-y-6">
                {selectedType === null ? (
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 flex flex-col min-h-[460px] max-h-[460px]">
                    <h2 className="text-lg font-medium mb-4">Что создаём?</h2>
                    <div className="space-y-2 flex-1 flex flex-col justify-center gap-2">
                      {TYPE_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setSelectedType(opt)}
                          className="w-full text-left px-4 py-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 border border-gray-700 hover:border-purple-500/50 transition"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-500">Создаём:</span> <span className="font-medium text-white">{selectedType}</span>
                    </p>
                    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 flex flex-col min-h-[620px] max-h-[620px]">
                      <h2 className="text-lg font-medium mb-4">{current?.title}</h2>
                      <div className="flex-1 overflow-auto">
                        {renderStepContent()}
                      </div>
                      <div className="mt-6 flex items-center justify-between gap-4 border-t border-gray-700/50 pt-6">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleBackStep}
                            className="rounded-xl px-4 py-2 font-medium text-gray-400 hover:text-white transition"
                          >
                            Назад
                          </button>
                          {/* Secondary "Далее" for description step */}
                          {current?.id === "description" && (
                            <button
                              type="button"
                              onClick={() => handleStepNext()}
                              className="rounded-xl px-4 py-2 font-medium text-gray-300 hover:text-white hover:bg-gray-700/70 border border-gray-700/70 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isStep2GenerateDisabled}
                            >
                              Далее
                            </button>
                          )}
                          {/* Secondary "Далее" for steps 3-7 (non-last) */}
                          {!isLast && current?.id !== "description" && (
                            <button
                              type="button"
                              onClick={() => handleStepNext()}
                              className="rounded-xl px-4 py-2 font-medium text-gray-300 hover:text-white hover:bg-gray-700/70 border border-gray-700/70 transition"
                            >
                              Далее
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (current?.id === "description" || !isLast) {
                              // TODO: trigger immediate generation without going through the remaining steps
                              return;
                            }
                            // last step: go through normal submit flow
                            handleStepNext();
                          }}
                          className="bg-purple-600 hover:bg-purple-500 rounded-xl px-4 py-2 font-medium transition disabled:opacity-50"
                          disabled={isStep2GenerateDisabled}
                        >
                          {current?.id === "description" || !isLast ? "Сгенерировать сейчас" : "Сгенерировать"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </main>
            <div className="w-full md:w-[22rem] shrink-0 flex flex-col border-t md:border-t-0 md:border-l border-gray-800 h-80 md:h-full md:min-h-0">
              <AvatarChatSidebar creationType={selectedType} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
