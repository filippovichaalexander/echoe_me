"use client";

export interface ProjectDirFile {
  id: string;
  name: string;
  type: "composition" | "stem" | "modification";
  createdAt?: string;
}

export interface ProjectDirSidebarProps {
  projectName: string;
  projectId: string;
  files?: ProjectDirFile[];
  className?: string;
}

export default function ProjectDirSidebar({
  projectName,
  projectId,
  files = [],
  className = "",
}: ProjectDirSidebarProps) {
  const compositions = files.filter((f) => f.type === "composition");
  const stems = files.filter((f) => f.type === "stem");
  const modifications = files.filter((f) => f.type === "modification");

  return (
    <aside
      className={`w-56 shrink-0 flex flex-col border-r border-gray-800 bg-gray-900/50 ${className}`}
      aria-label="Директория проекта"
    >
      <div className="p-3 border-b border-gray-800">
        <h2 className="text-sm font-medium text-white truncate" title={projectName}>
          {projectName}
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Директория проекта</p>
      </div>
      <div className="flex-1 overflow-auto py-2">
        {compositions.length > 0 && (
          <div className="px-3 mb-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Композиции
            </p>
            <ul className="space-y-0.5">
              {compositions.map((f) => (
                <li
                  key={f.id}
                  className="text-sm text-gray-300 truncate px-2 py-1 rounded hover:bg-gray-800/50"
                  title={f.name}
                >
                  {f.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        {stems.length > 0 && (
          <div className="px-3 mb-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Стемы
            </p>
            <ul className="space-y-0.5">
              {stems.map((f) => (
                <li
                  key={f.id}
                  className="text-sm text-gray-300 truncate px-2 py-1 rounded hover:bg-gray-800/50"
                  title={f.name}
                >
                  {f.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        {modifications.length > 0 && (
          <div className="px-3 mb-2">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              Модификации
            </p>
            <ul className="space-y-0.5">
              {modifications.map((f) => (
                <li
                  key={f.id}
                  className="text-sm text-gray-300 truncate px-2 py-1 rounded hover:bg-gray-800/50"
                  title={f.name}
                >
                  {f.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        {files.length === 0 && (
          <div className="px-3 py-4 text-center">
            <p className="text-xs text-gray-500">
              Здесь будут сохранённые файлы композиций, стемов и модификаций этого диалога.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
