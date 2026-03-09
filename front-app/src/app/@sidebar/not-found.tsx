import { HelpCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SidebarNotFound() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-[#2B2D31] text-center">
      <div className="w-12 h-12 bg-gray-200 dark:bg-white/10 rounded-full flex items-center justify-center mb-4">
        <HelpCircle className="w-6 h-6 text-gray-500 dark:text-[#949BA4]" />
      </div>
      <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
        見つかりません
      </h3>
      <p className="text-xs text-gray-500 dark:text-[#949BA4] mb-4">
        指定されたコンテンツが見つかりませんでした。
      </p>
      <Button
        asChild
        className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white border-0"
        size="sm"
      >
        <Link href="/">ホームへ</Link>
      </Button>
    </div>
  );
}
