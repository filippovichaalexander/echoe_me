"use client";

import Link from "next/link";
import { useLibrary } from "@/lib/hooks/useLibrary";
import { useSubscription } from "@/lib/hooks/useSubscription";
import StorageQuota from "@/app/components/library/StorageQuota";
import TariffInfo from "@/app/components/library/TariffInfo";
import MusicPlayer from "@/app/components/MusicPlayer";
import type { LibraryTrack } from "@/lib/api/types";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function TrackCard({
  track,
  onRemove,
}: {
  track: LibraryTrack;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-700/50 hover:border-gray-600 transition">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium truncate">{track.name || "Без названия"}</h3>
          {track.prompt && (
            <p className="text-sm text-gray-400 truncate mt-0.5">{track.prompt}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">{formatDate(track.created_at)}</p>
        </div>
        <button
          type="button"
          onClick={() => onRemove(track.id)}
          className="text-gray-400 hover:text-red-400 transition shrink-0"
          title="Удалить"
        >
          🗑️
        </button>
      </div>
      <div className="mt-3">
        <MusicPlayer audioUrl={track.url} />
      </div>
    </div>
  );
}

export default function LibraryPage() {
  const { tracks, loading, error, removeTrack } = useLibrary();
  const { tier, usage, limits, refresh: refreshSubscription } = useSubscription();

  const handleRemove = async (id: string) => {
    try {
      await removeTrack(id);
      await refreshSubscription();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <span aria-hidden>📚</span>
                Моя библиотека
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">
                Сохранённые треки и материалы
              </p>
            </div>
            <div className="flex items-center gap-4">
              <StorageQuota
                usage={usage}
                limits={limits}
                tier={tier}
                compact
              />
              <Link
                href="/"
                className="text-sm text-gray-400 hover:text-white transition"
              >
                ← На главную
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <aside className="lg:col-span-1">
            <StorageQuota
              usage={usage}
              limits={limits}
              tier={tier}
              compact={false}
            />
            <TariffInfo currentTier={tier} />
            <p className="text-gray-500 text-sm mt-4">
              Сохраняйте треки с главной страницы кнопкой «В библиотеку».
            </p>
          </aside>

          <div className="lg:col-span-2">
            {loading && (
              <div className="text-gray-400 py-8">Загрузка…</div>
            )}
            {error && (
              <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-300 text-sm mb-6">
                {error}
              </div>
            )}
            {!loading && tracks.length === 0 && (
              <div className="bg-gray-800/50 rounded-2xl p-12 border border-gray-700/50 text-center text-gray-400">
                <span className="text-5xl block mb-4" aria-hidden>🎵</span>
                <p className="mb-2">Пока нет сохранённых треков.</p>
                <p className="text-sm">
                  Создайте музыку на <Link href="/" className="text-purple-400 hover:underline">главной</Link> и нажмите «В библиотеку».
                </p>
              </div>
            )}
            {!loading && tracks.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Композиции</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tracks.map((track) => (
                    <TrackCard
                      key={track.id}
                      track={track}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
