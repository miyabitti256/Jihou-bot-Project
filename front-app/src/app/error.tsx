"use client";

import Link from "next/link";
import { useEffect } from "react";
import { FaDiscord } from "react-icons/fa";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // biome-ignore lint/suspicious/noConsole: エラーページなので表示
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#313338] p-4 font-sans">
      <div className="max-w-md w-full bg-white dark:bg-[#2B2D31] rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-white/5 text-center flex flex-col items-center p-8 md:p-10 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-[#ED4245]"></div>

        <div className="w-20 h-20 bg-red-50 dark:bg-[#ED4245]/10 rounded-full flex items-center justify-center mb-6">
          <FaDiscord className="h-10 w-10 text-[#ED4245]" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          予期せぬエラーが発生しました
        </h1>

        <p className="text-gray-500 dark:text-[#949BA4] mb-8 text-sm">
          システムで問題が発生しました。しばらくしてから再度お試しください。問題が解決しない場合、管理者にお問い合わせください。
        </p>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
          >
            再読み込み
          </button>

          <Link
            href="/"
            className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-[#1E1F22] dark:hover:bg-[#313338] text-gray-700 dark:text-gray-200 font-semibold py-3 px-4 rounded-lg transition-colors border border-gray-200 dark:border-white/5 flex items-center justify-center"
          >
            ホームへ戻る
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-gray-400 dark:text-[#5C5E66]">
            エラーID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
