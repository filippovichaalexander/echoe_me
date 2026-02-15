"use client";

export default function InteractionHistorySection() {
  return (
    <section className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
      <h3 className="text-2xl font-bold mb-6">📜 История взаимодействий</h3>
      <p className="text-gray-400 text-sm mb-6">
        Здесь будет список твоих генераций, изменений и анализов. Скоро
        подключим к бэкенду.
      </p>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-700/50 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎵</span>
              <div>
                <div className="text-sm text-gray-400">Генерация</div>
                <div className="font-medium">Пример записи #{i}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="w-full mt-6 py-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition text-gray-300 font-medium"
      >
        Загрузить ещё
      </button>
    </section>
  );
}
