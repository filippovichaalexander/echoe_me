"use client";

import Link from "next/link";

export default function CreatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Создание музыки</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/create/wizard"
          className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition"
        >
          <span className="text-2xl block mb-2">🎭</span>
          <strong>Конструктор с аватаром</strong>
          <p className="text-gray-400 text-sm mt-1">Пошаговый конструктор и чат с аватаром</p>
        </Link>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <span className="text-2xl block mb-2">🎤</span>
          <strong>Голосовой ввод</strong>
          <p className="text-gray-400 text-sm mt-1">Опиши голосом</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <span className="text-2xl block mb-2">📁</span>
          <strong>Загрузка файлов</strong>
          <p className="text-gray-400 text-sm mt-1">Трек или стемы</p>
        </div>
      </div>
      <Link href="/" className="inline-block mt-6 text-purple-400 hover:underline">
        ← На главную
      </Link>
    </div>
  );
}
