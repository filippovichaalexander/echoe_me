"use client";

import Link from "next/link";
import VoiceRecorder from "@/app/components/VoiceRecorder";

export default function VoicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Голосовой ввод</h1>
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <VoiceRecorder onRecordingComplete={() => {}} />
      </div>
      <Link href="/create" className="inline-block mt-6 text-purple-400 hover:underline">
        ← Назад
      </Link>
    </div>
  );
}
