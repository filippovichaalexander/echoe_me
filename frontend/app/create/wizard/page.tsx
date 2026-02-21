"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import AvatarChatSidebar from "@/app/components/AvatarChatSidebar";
import ProjectDirSidebar, { ProjectDirFile } from "@/app/components/ProjectDirSidebar";
import { useLibraryProjects } from "@/lib/hooks/useLibraryProjects";
import type { LibraryProject } from "@/lib/api/types";

const TYPE_OPTIONS = ["Полная композиция", "Стем", "Модификация"] as const;

const STEPS = [
  { id: "mood", title: "Настроение?", type: "text" as const },
  { id: "details", title: "Детали", type: "sliders" as const },
];

type ProjectChoice = null | "create" | "choose";

interface WizardProject {
  id: string;
  name: string;
  files: ProjectDirFile[];
}

/** Валидация имени проекта: без пробелов, простая проверка символов. */
function validateProjectName(name: string): string | null {
  const t = name.trim();
  if (!t) return "Введите имя проекта";
  if (/\s/.test(name)) return "Пробелы не допускаются";
  if (t.length > 64) return "Не более 64 символов";
  if (!/^[\w\-]+$/.test(t)) return "Только буквы, цифры, дефис и подчёркивание";
  if (!/[a-zA-Zа-яА-ЯёЁ]/.test(t)) return "Нужна хотя бы одна буква";
  return null;
}

function toWizardProject(p: LibraryProject): WizardProject {
  return {
    id: p.id,
    name: p.name,
    files: (p.files ?? []).map((f) => ({
      id: f.id,
      name: f.name,
      type: (f.type === "stem" ? "stem" : f.type === "modification" ? "modification" : "composition") as "composition" | "stem" | "modification",
      createdAt: undefined,
    })),
  };
}

export default function WizardPage() {
  const { projects, loading: projectsLoading, error: projectsError, createProject, refresh: refreshProjects } = useLibraryProjects();
  const [projectChoice, setProjectChoice] = useState<ProjectChoice>(null);
  const [projectName, setProjectName] = useState("");
  const [createError, setCreateError] = useState<string | null>(null);
  const [currentProject, setCurrentProject] = useState<WizardProject | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (projectChoice === "choose") refreshProjects();
  }, [projectChoice, refreshProjects]);

  const wizardSteps = STEPS;
  const current = wizardSteps[step];
  const isLast = step === wizardSteps.length - 1;

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

  const showMainLayout = projectChoice === "create" && currentProject;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex flex-col">
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur shrink-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Пошаговый конструктор</h1>
          <Link
            href="/create"
            className="text-sm text-gray-400 hover:text-white transition"
          >
            ← Назад
          </Link>
        </div>
      </header>

      {/* Модальное окно: Создать проект / Выбрать существующий */}
      {projectChoice === null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-choice-title"
        >
          <div className="bg-gray-800/95 rounded-2xl border border-gray-700 shadow-xl max-w-md w-full p-6">
            <h2 id="project-choice-title" className="text-lg font-medium mb-4">
              Начать с проекта
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="wizard-project-name" className="block text-sm text-gray-400 mb-1">
                  Имя проекта
                </label>
                <input
                  id="wizard-project-name"
                  type="text"
                  placeholder="Мой_проект"
                  className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                  value={projectName}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\s/g, "");
                    setProjectName(v);
                    if (createError) setCreateError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === " ") e.preventDefault();
                  }}
                  aria-invalid={!!createError}
                  aria-describedby={createError ? "project-name-error" : undefined}
                />
                {createError && (
                  <p id="project-name-error" className="mt-1 text-sm text-red-400" role="alert">
                    {createError}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Без пробелов; буквы, цифры, дефис и подчёркивание.
                </p>
              </div>
              <button
                onClick={() => handleCreateProject()}
                className="w-full px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 border border-transparent font-medium transition"
              >
                Создать проект
              </button>
              <button
                onClick={() => setProjectChoice("choose")}
                className="w-full text-left px-4 py-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 border border-gray-700 hover:border-purple-500/50 transition font-medium"
              >
                Выбрать существующий проект
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Экран выбора существующего проекта (проекты из /library) */}
      {projectChoice === "choose" && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-xl">
            <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-lg font-medium mb-4">Выберите проект</h2>
              {projectsError && (
                <p className="text-red-400 text-sm mb-4" role="alert">
                  {projectsError}
                </p>
              )}
              {projectsLoading && (
                <p className="text-gray-400 text-sm mb-4">Загрузка проектов…</p>
              )}
              {!projectsLoading && projects.length === 0 && (
                <>
                  <p className="text-gray-400 text-sm mb-4">
                    Пока нет сохранённых проектов. Создайте новый.
                  </p>
                  <button
                    onClick={() => {
                      setProjectChoice(null);
                      setProjectName("");
                      setCreateError(null);
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 border border-transparent font-medium transition"
                  >
                    Создать проект
                  </button>
                </>
              )}
              {!projectsLoading && projects.length > 0 && (
                <div className="space-y-2">
                  {projects.map((proj) => (
                    <button
                      key={proj.id}
                      onClick={() => handleChooseProject(proj)}
                      className="w-full text-left px-4 py-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 border border-gray-700 hover:border-purple-500/50 transition"
                    >
                      <span className="font-medium">{proj.name}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        {new Date(proj.created_at).toLocaleDateString("ru-RU")}
                      </span>
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setProjectChoice(null);
                      setProjectName("");
                      setCreateError(null);
                    }}
                    className="w-full px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white transition border border-gray-700 hover:border-gray-600"
                  >
                    + Создать новый проект
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Единый layout: сайдбар проекта + контент (Что создаём? + шаги) + чат */}
      {showMainLayout && (
        <div className="flex-1 flex flex-row min-h-0">
          <ProjectDirSidebar
            projectName={currentProject.name}
            projectId={currentProject.id}
            files={currentProject.files}
          />
          <div className="flex-1 flex flex-col md:flex-row min-h-0 min-w-0">
            <main className="flex-1 min-w-0 overflow-auto">
              <div className="container mx-auto px-4 py-8 max-w-xl space-y-6">
                {/* Пока тип не выбран — только блок «Что создаём?» */}
                {selectedType === null ? (
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                    <h2 className="text-lg font-medium mb-4">Что создаём?</h2>
                    <div className="space-y-2">
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
                    {/* Выбранный тип закреплён слева вверху на странице формы */}
                    <p className="text-sm text-gray-400">
                      <span className="text-gray-500">Создаём:</span>{" "}
                      <span className="font-medium text-white">{selectedType}</span>
                    </p>

                    {/* Блок текущего шага: Настроение?, Детали и т.д. */}
                    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                      <h2 className="text-lg font-medium mb-4">{current.title}</h2>
                      {current.type === "text" && (
                        <div>
                          <input
                            type="text"
                            placeholder="Опиши настроение"
                            className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                            value={(data[current.id] as string) ?? ""}
                            onChange={(e) =>
                              setData((prev) => ({ ...prev, [current.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") setStep(step + 1);
                            }}
                          />
                          <div className="mt-4 flex gap-2">
                            <button
                              type="button"
                              onClick={() => setStep(step + 1)}
                              className="bg-purple-600 hover:bg-purple-500 rounded-xl px-4 py-2 font-medium transition"
                            >
                              Далее
                            </button>
                            <button
                              type="button"
                              onClick={() => setStep(step + 1)}
                              className="rounded-xl px-4 py-2 font-medium text-gray-400 hover:text-white border border-gray-600 hover:border-gray-500 transition"
                            >
                              Пропустить
                            </button>
                          </div>
                        </div>
                      )}
                      {current.type === "sliders" && (
                        <div>
                          <p className="text-gray-400 mb-4">
                            Энергия, сложность — позже слайдеры.
                          </p>
                          <button
                            type="button"
                            onClick={() => setStep(step + 1)}
                            className="bg-purple-600 hover:bg-purple-500 rounded-xl px-4 py-2 font-medium transition"
                          >
                            {isLast ? "Создать" : "Далее"}
                          </button>
                        </div>
                      )}
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
