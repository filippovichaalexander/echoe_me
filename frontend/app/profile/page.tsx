"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useAvatar } from "@/lib/hooks/useAvatar";
import ProfileHeader from "./components/ProfileHeader";
import AvatarDashboardSection from "./components/AvatarDashboardSection";
import InteractionHistorySection from "./components/InteractionHistorySection";
import AnalyticsSection from "./components/AnalyticsSection";
import InsightsSection from "./components/InsightsSection";
import LibrarySection from "./components/LibrarySection";
import EvolutionSection from "./components/EvolutionSection";
import PackageSection from "./components/PackageSection";
import SettingsSection from "./components/SettingsSection";

const TABS = [
  { id: "dashboard", label: "Обзор", icon: "🎭" },
  { id: "history", label: "История", icon: "📜" },
  { id: "analytics", label: "Аналитика", icon: "📊" },
  { id: "insights", label: "Инсайты", icon: "🧠" },
  { id: "library", label: "Библиотека", icon: "🎨" },
  { id: "evolution", label: "Эволюция", icon: "🌱" },
  { id: "package", label: "Пакет", icon: "📦" },
  { id: "settings", label: "Настройки", icon: "⚙️" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading } = useAvatar();
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <ProfileHeader user={user} />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Tab navigation */}
        <div className="mb-6 sm:mb-8 overflow-x-auto">
          <div className="flex gap-1 min-w-max pb-2">
            {TABS.map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                  activeTab === id
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700"
                }`}
              >
                <span className="mr-1.5">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {loading && !profile && (
          <div className="text-center py-12 text-gray-400">Загрузка…</div>
        )}

        {!loading && !profile && activeTab !== "package" && activeTab !== "settings" && (
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700/50 text-center text-gray-400">
            <p className="mb-4">
              Выполни действия на главной — появится профиль аватара и разделы
              кабинета.
            </p>
            <a href="/" className="text-purple-400 hover:underline">
              Перейти на главную →
            </a>
          </div>
        )}

        {(profile || activeTab === "package" || activeTab === "settings") && (
          <>
            {activeTab === "dashboard" && profile && (
              <AvatarDashboardSection profile={profile} />
            )}
            {activeTab === "history" && <InteractionHistorySection />}
            {activeTab === "analytics" && profile && (
              <AnalyticsSection profile={profile} />
            )}
            {activeTab === "insights" && <InsightsSection />}
            {activeTab === "library" && <LibrarySection />}
            {activeTab === "evolution" && profile && (
              <EvolutionSection profile={profile} />
            )}
            {activeTab === "package" && <PackageSection />}
            {activeTab === "settings" && <SettingsSection />}
          </>
        )}
      </div>
    </div>
  );
}
