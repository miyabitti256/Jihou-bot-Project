import Link from "next/link";
import { FaUser } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 min-h-[calc(100vh-3rem)] md:min-h-screen bg-gray-50 dark:bg-[#313338] text-center">
      <div className="w-24 h-24 bg-gray-200 dark:bg-[#2B2D31] rounded-full flex items-center justify-center mb-6 shadow-inner">
        <FaUser className="w-12 h-12 text-gray-400 dark:text-[#949BA4]" />
      </div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        ユーザーが見つかりませんでした
      </h1>
      <p className="text-gray-500 dark:text-[#949BA4] mb-8 max-w-md leading-relaxed">
        指定されたIDのユーザーは存在しないか、アクセスできない可能性があります。
      </p>
      <Link
        href="/users"
        className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-2.5 px-6 rounded-[4px] transition-colors shadow-sm"
      >
        ユーザー一覧に戻る
      </Link>
    </div>
  );
}
