"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WizardRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/create/wizard");
  }, [router]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-gray-400">
      Перенаправление…
    </div>
  );
}
