import Link from "next/link";
import { FaDiscord } from "react-icons/fa";

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center bg-gray-50 dark:bg-[#313338] p-4 font-sans text-center">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Wumpus / Mascot Placeholder - Using a generic styling as Wumpus is copyrighted by Discord */}
        <div className="w-32 h-32 bg-[#5865F2]/10 dark:bg-[#2B2D31]/50 rounded-full flex items-center justify-center mb-8 relative shadow-inner">
          <FaDiscord className="h-16 w-16 text-[#5865F2] opacity-50" />
          <div className="absolute -bottom-2 -right-2 text-4xl">🔍</div>
        </div>

        <h1 className="text-5xl font-black text-[#5865F2] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          ページが見つかりません
        </h2>

        <p className="text-gray-500 dark:text-[#949BA4] mb-8 text-sm max-w-sm leading-relaxed">
          お探しのページは、削除されたか、名前が変更されたか、現在利用できない可能性があります。URLが正しいかもう一度ご確認ください。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link
            href="/"
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-3 px-8 rounded-[4px] transition-colors shadow-md text-base"
          >
            ホームへ戻る
          </Link>
          <Link
            href="/dashboard"
            className="bg-transparent hover:bg-gray-100 dark:hover:bg-[#2B2D31] text-gray-700 dark:text-[#DBDEE1] font-semibold py-3 px-8 rounded-[4px] transition-colors text-base"
          >
            ダッシュボードへ
          </Link>
        </div>
      </div>
    </div>
  );
}
