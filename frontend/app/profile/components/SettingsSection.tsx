"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

export default function SettingsSection() {
  const { user } = useAuth();

  return (
    <section className="space-y-8">
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-2xl font-bold mb-6">⚙️ Настройки аватара</h3>
        <p className="text-gray-400 text-sm mb-6">
          Скоро здесь можно будет настроить скорость обучения, источники данных
          и приватность.
        </p>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <span className="text-gray-300">Скорость обучения</span>
            <span className="text-gray-500 text-sm">Обычная</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <span className="text-gray-300">Уведомления об инсайтах</span>
            <span className="text-gray-500 text-sm">Скоро</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h3 className="text-2xl font-bold mb-6">Аккаунт</h3>
        <div className="space-y-2 text-sm">
          <p className="text-gray-400">
            <span className="text-gray-500">Email:</span> {user?.email}
          </p>
          {user?.name && (
            <p className="text-gray-400">
              <span className="text-gray-500">Имя:</span> {user.name}
            </p>
          )}
        </div>
        <Link
          href="/forgot-password"
          className="inline-block mt-4 text-purple-400 hover:text-purple-300 text-sm"
        >
          Сменить пароль →
        </Link>
      </div>
    </section>
  );
}
