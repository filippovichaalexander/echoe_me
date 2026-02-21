"use client";

import type { LibraryProject } from "@/lib/api/types";

export interface WizardChooseProjectProps {
  projects: LibraryProject[];
  loading: boolean;
  error: string | null;
  onSelect: (project: LibraryProject) => void;
  onCreateNew: () => void;
}

export function WizardChooseProject({ projects, loading, error, onSelect, onCreateNew }: WizardChooseProjectProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
          <h2 className="text-lg font-medium mb-4">Выберите проект</h2>
          {error && (
            <p className="text-red-400 text-sm mb-4" role="alert">
              {error}
            </p>
          )}
          {loading && (
            <p className="text-gray-400 text-sm mb-4">Загрузка проектов…</p>
          )}
          {!loading && projects.length === 0 && (
            <>
              <p className="text-gray-400 text-sm mb-4">
                Пока нет сохранённых проектов. Создайте новый.
              </p>
              <button
                onClick={onCreateNew}
                className="w-full px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 border border-transparent font-medium transition"
              >
                Создать проект
              </button>
            </>
          )}
          {!loading && projects.length > 0 && (
            <div className="space-y-2">
              {projects.map((proj) => (
                <button
                  key={proj.id}
                  onClick={() => onSelect(proj)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 border border-gray-700 hover:border-purple-500/50 transition"
                >
                  <span className="font-medium">{proj.name}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {new Date(proj.created_at).toLocaleDateString("ru-RU")}
                  </span>
                </button>
              ))}
              <button
                onClick={onCreateNew}
                className="w-full px-4 py-2 rounded-xl text-sm text-gray-400 hover:text-white transition border border-gray-700 hover:border-gray-600"
              >
                + Создать новый проект
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
