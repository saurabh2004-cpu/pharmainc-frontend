"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="text-gray-500 hover:text-gray-700 transition-colors"
      aria-label="Go back"
    >
      <ArrowLeft className="w-6 h-6" />
    </button>
  );
}
