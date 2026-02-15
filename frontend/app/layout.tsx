import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Music Avatar — Твой музыкальный аватар",
  description: "Цифровой музыкальный аватар, который учится на твоих действиях",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-[#0a0a0a] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
