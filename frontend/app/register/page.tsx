"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  checkPasswordStrength,
  getPasswordStrengthLabel,
  validatePasswordForSubmit,
  MIN_PASSWORD_LENGTH,
} from "@/lib/utils/password";

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strengthScore = checkPasswordStrength(password);
  const strengthLabel = getPasswordStrengthLabel(strengthScore);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const pwdValidation = validatePasswordForSubmit(password);
    if (!pwdValidation.ok) {
      setError(pwdValidation.message ?? "Некорректный пароль");
      return;
    }
    const trimmedPassword = password.trim();
    if (trimmedPassword !== passwordConfirm.trim()) {
      setError("Пароли не совпадают");
      return;
    }
    const confirmValidation = validatePasswordForSubmit(passwordConfirm);
    if (!confirmValidation.ok) {
      setError(confirmValidation.message ?? "Некорректное подтверждение пароля");
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), trimmedPassword, passwordConfirm.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Регистрация</h1>
        <p className="text-gray-400 text-center mb-8">
          Создайте аккаунт Music Avatar
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Имя
            </label>
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
              placeholder="Как к вам обращаться"
            />
          </div>
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
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Пароль
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
              placeholder={`Минимум ${MIN_PASSWORD_LENGTH} символов`}
            />
            {password.length > 0 && (
              <p
                className={`mt-1 text-xs ${
                  strengthScore <= 1 ? "text-amber-400" : strengthScore <= 2 ? "text-yellow-400" : "text-green-400"
                }`}
              >
                Сила пароля: {strengthLabel}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-300 mb-1">
              Подтверждение пароля
            </label>
            <input
              id="passwordConfirm"
              type="password"
              required
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              className="w-full bg-gray-900 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
              placeholder="Повторите пароль"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl py-3 font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Регистрация…" : "Зарегистрироваться"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="text-purple-400 hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
