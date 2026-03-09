"use client";

import { AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function SidebarError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // biome-ignore lint/suspicious/noConsole: サイドバーのエラーをログ出力
    console.error("Sidebar Error:", error);
  }, [error]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-[#2B2D31] text-center">
      <div className="w-12 h-12 bg-red-100 dark:bg-[#ED4245]/20 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6 text-[#ED4245]" />
      </div>
      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
        読み込みエラー
      </h3>
      <p className="text-xs text-gray-500 dark:text-[#949BA4] mb-4">
        サイドバーの読み込みに失敗しました。
      </p>
      <Button
        onClick={() => reset()}
        className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white"
        size="sm"
      >
        再読み込み
      </Button>
    </div>
  );
}
