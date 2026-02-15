"use client";

import Link from "next/link";
import { useAvatar } from "@/lib/hooks/useAvatar";

export default function ProfilePage() {
  const { profile, loading } = useAvatar();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Профиль аватара</h1>
      {loading && <p className="text-gray-400">Загрузка…</p>}
      {profile && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-2xl">
          <pre className="text-sm text-gray-300 overflow-auto">
            {JSON.stringify(profile, null, 2)}
          </pre>
        </div>
      )}
      {!loading && !profile && (
        <p className="text-gray-400">Выполни действия на главной — появится профиль.</p>
      )}
      <Link href="/" className="inline-block mt-6 text-purple-400 hover:underline">
        ← На главную
      </Link>
    </div>
  );
}
