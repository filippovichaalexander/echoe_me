"use client";

export default function LibrarySection() {
  return (
    <section className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
      <h3 className="text-2xl font-bold mb-6">🎨 Библиотека созданного</h3>
      <p className="text-gray-400 text-sm mb-6">
        Сохранённые треки и плейлисты появятся здесь после добавления
        функционала сохранения с главной страницы.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-700/50 rounded-xl p-4 border border-gray-700/50 aspect-video flex items-center justify-center text-gray-500"
          >
            Слот трека
          </div>
        ))}
      </div>
    </section>
  );
}
