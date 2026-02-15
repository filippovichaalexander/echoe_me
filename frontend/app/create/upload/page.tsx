"use client";

import { useState } from "react";
import Link from "next/link";

export default function UploadPage() {
  const [files, setFiles] = useState<FileList | null>(null);

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Загрузка трека или стемов</h1>
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <input
          type="file"
          accept="audio/*"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="block w-full text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-purple-600 file:text-white"
        />
        {files && <p className="mt-2 text-sm text-gray-400">Выбрано файлов: {files.length}</p>}
      </div>
      <Link href="/create" className="inline-block mt-6 text-purple-400 hover:underline">
        ← Назад
      </Link>
    </div>
  );
}
