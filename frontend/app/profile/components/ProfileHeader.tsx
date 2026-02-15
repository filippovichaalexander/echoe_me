"use client";

import Link from "next/link";
import type { AuthUser } from "@/lib/api/types";

export default function ProfileHeader({ user }: { user: AuthUser | null }) {
  if (!user) return null;
  return (
    <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Личный кабинет</h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {user.name || user.email}
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition"
          >
            ← На главную
          </Link>
        </div>
      </div>
    </header>
  );
}
