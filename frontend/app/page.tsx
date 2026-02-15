"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { useAvatar } from "@/lib/hooks/useAvatar";
import VoiceRecorder from "@/app/components/VoiceRecorder";
import MusicPlayer from "@/app/components/MusicPlayer";
import AvatarVisualizer from "@/app/components/AvatarVisualizer";
import {
  MusicTagSelector,
  type SelectedTags,
  type TagCategory,
} from "@/app/components/MusicTagSelector";

const emptyTags: SelectedTags = {
  style: [],
  instruments: [],
  mood: [],
};

export default function HomePage() {
  const { user, logout } = useAuth();
  const { profile, generateMusic, refreshProfile, loading, error } = useAvatar();
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [selectedTags, setSelectedTags] = useState<SelectedTags>(emptyTags);

  const handleTagSelect = (category: TagCategory, tag: string) => {
    setSelectedTags((prev) => ({
      ...prev,
      [category]: [...prev[category], tag],
    }));
  };

  const handleTagRemove = (category: TagCategory, tag: string) => {
    setSelectedTags((prev) => ({
      ...prev,
      [category]: prev[category].filter((t) => t !== tag),
    }));
  };

  const handleCreateMusic = async () => {
    if (!prompt.trim()) return;
    try {
      const result = await generateMusic({
        context: {
          prompt: prompt.trim(),
          style: selectedTags.style,
          instruments: selectedTags.instruments,
          mood: selectedTags.mood,
        },
      });
      if (result?.audio_url) setCurrentAudio(result.audio_url);
      await refreshProfile();
    } catch (e) {
      console.error("Error creating music:", e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <span className="text-gray-400 text-sm truncate">
            {user?.name || user?.email}
          </span>
          <button
            type="button"
            onClick={() => logout()}
            className="text-sm text-gray-400 hover:text-white transition"
          >
            Выйти
          </button>
        </div>
        <h1 className="text-4xl font-bold mb-2">
          🎵 Создай свою музыкальную идентичность
        </h1>
        <p className="text-gray-400">
          Твой цифровой аватар учится на каждом твоём музыкальном выборе
        </p>
      </header>

      <main className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-bold mb-4">
                Опиши музыкальный момент
              </h2>
              <div className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Например: прогулка по осеннему лесу под дождь"
                    className="flex-1 min-w-0 bg-gray-900 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreateMusic()}
                  />
                  <div className="lg:w-[26rem] flex-shrink-0">
                    <MusicTagSelector
                      selected={selectedTags}
                      onSelect={handleTagSelect}
                      onRemove={handleTagRemove}
                    />
                  </div>
                </div>
                <div className="flex gap-4 flex-wrap">
                  <button
                    onClick={handleCreateMusic}
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl px-6 py-3 font-medium hover:opacity-90 transition disabled:opacity-50"
                  >
                    {loading ? "Создаём…" : "Создать"}
                  </button>
                  <Link
                    href="/create"
                    className="rounded-xl px-6 py-3 font-medium border border-gray-600 hover:border-purple-500 transition"
                  >
                    Продвинутый конструктор
                  </Link>
                </div>
                <VoiceRecorder
                  onRecordingComplete={async () => {
                    await handleCreateMusic();
                  }}
                />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-400">{error}</p>
              )}
            </section>

            {currentAudio && (
              <section className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold mb-4">Твоя музыка</h3>
                <MusicPlayer audioUrl={currentAudio} />
              </section>
            )}
          </div>

          <div className="space-y-8">
            <section className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-2xl font-bold mb-4">Твой музыкальный аватар</h2>
              {profile ? (
                <AvatarVisualizer profile={profile} />
              ) : (
                <div className="text-center py-8 text-gray-400">
                  Выполни действия — аватар начнёт учиться.
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
