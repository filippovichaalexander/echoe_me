"use client";

import Link from "next/link";
import { useAvatar } from "@/lib/hooks/useAvatar";

export default function VisualizationPage() {
  const { profile } = useAvatar();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Визуализация вектора вкуса</h1>
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        {profile ? (
          <p className="text-gray-300">
            Здесь будет визуализация вектора (D3/Three.js). Профиль загружен.
          </p>
        ) : (
          <p className="text-gray-400">Сначала выполни действия на главной.</p>
        )}
      </div>
      <Link href="/profile" className="inline-block mt-6 text-purple-400 hover:underline">
        ← В профиль
      </Link>
    </div>
  );
}
