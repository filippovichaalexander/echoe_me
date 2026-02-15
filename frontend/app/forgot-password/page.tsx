"use client";

import { useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiClient.post("/api/auth/forgot-password", { email: email.trim() });
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка отправки");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Письмо отправлено</h1>
          <p className="text-gray-400 mb-8">
            Если аккаунт с таким email существует, вы получите письмо с инструкциями по восстановлению пароля.
          </p>
          <Link href="/login" className="text-purple-400 hover:underline">
            Вернуться ко входу
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Восстановление пароля</h1>
        <p className="text-gray-400 text-center mb-8">
          Введите email — мы отправим ссылку для сброса пароля
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Электронная почта
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
              placeholder="you@example.com"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl py-3 font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Отправка…" : "Отправить ссылку"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          <Link href="/login" className="text-purple-400 hover:underline">
            ← Вернуться ко входу
          </Link>
        </p>
      </div>
    </div>
  );
}
