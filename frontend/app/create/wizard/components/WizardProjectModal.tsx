"use client";

export interface WizardProjectModalProps {
  projectName: string;
  setProjectName: (v: string) => void;
  createError: string | null;
  setCreateError: (v: string | null) => void;
  onCreate: () => void;
  onChooseExisting: () => void;
}

export function WizardProjectModal({
  projectName,
  setProjectName,
  createError,
  setCreateError,
  onCreate,
  onChooseExisting,
}: WizardProjectModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-8 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-choice-title"
    >
      <div className="bg-gray-800/95 rounded-2xl border border-gray-700 shadow-xl max-w-2xl w-full p-8 sm:p-10">
        <h2 id="project-choice-title" className="text-xl font-semibold mb-6">
          Начать с проекта
        </h2>
        <div className="space-y-5">
          <div>
            <label htmlFor="wizard-project-name" className="block text-sm text-gray-400 mb-1">
              Имя проекта
            </label>
            <input
              id="wizard-project-name"
              type="text"
              placeholder="Мой_проект"
              className="w-full bg-gray-900 rounded-xl px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 text-base"
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
            onClick={onCreate}
            className="w-full px-5 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 border border-transparent font-medium text-base transition"
          >
            Создать проект
          </button>
          <button
            onClick={onChooseExisting}
            className="w-full text-left px-5 py-4 rounded-xl bg-gray-700/50 hover:bg-gray-700 border border-gray-700 hover:border-purple-500/50 transition font-medium text-base"
          >
            Выбрать существующий проект
          </button>
        </div>
      </div>
    </div>
  );
}
