"use client";

export default function InsightsSection() {
  return (
    <section className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold">🧠 Что я о тебе узнал</h3>
        <button
          type="button"
          className="text-sm text-purple-400 hover:text-purple-300 transition"
        >
          Обновить
        </button>
      </div>
      <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-start gap-4">
          <span className="text-3xl">✨</span>
          <div>
            <h4 className="font-bold text-lg mb-2">Первый шаг</h4>
            <p className="text-purple-100 text-sm mb-4">
              Аватар начнёт формулировать инсайты по твоим действиям и
              предпочтениям — создавай музыку и отмечай, что нравится.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                className="bg-white/20 rounded-lg px-4 py-2 text-sm hover:bg-white/30 transition"
              >
                👍 Понятно
              </button>
            </div>
          </div>
        </div>
      </div>
      <p className="text-gray-400 text-sm mt-6">
        Наблюдения и предсказания появятся здесь после накопления данных.
      </p>
    </section>
  );
}
