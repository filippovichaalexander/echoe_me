"use client";

import Link from "next/link";
import { useLibrary } from "@/lib/hooks/useLibrary";
import { useSubscription } from "@/lib/hooks/useSubscription";
import StorageQuota from "@/app/components/library/StorageQuota";

export default function LibrarySection() {
  const { tracks, loading } = useLibrary();
  const { tier, usage, limits } = useSubscription();

  return (
    <section className="space-y-6">
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="text-2xl font-bold">🎨 Библиотека созданного</h3>
          <Link
            href="/library"
            className="text-purple-400 hover:text-purple-300 text-sm font-medium"
          >
            Открыть библиотеку →
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StorageQuota usage={usage} limits={limits} tier={tier} compact={false} />

          <div>
            {loading ? (
              <p className="text-gray-400 text-sm">Загрузка…</p>
            ) : tracks.length === 0 ? (
              <p className="text-gray-400 text-sm">
                Сохранённые треки появятся здесь. Сохраняйте с главной страницы
                кнопкой «В библиотеку».
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-gray-300 font-medium">
                  Сохранено треков: {tracks.length}
                </p>
                <Link
                  href="/library"
                  className="inline-block text-sm text-purple-400 hover:underline"
                >
                  Перейти в библиотеку
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
