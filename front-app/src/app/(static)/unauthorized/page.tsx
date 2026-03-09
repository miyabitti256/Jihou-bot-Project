import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 overflow-hidden bg-white dark:bg-[#313338]">
      <div className="mx-auto w-full max-w-md bg-white dark:bg-[#2B2D31] rounded-lg shadow-2xl p-8 border border-gray-200 dark:border-white/5 text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-[#ED4245]/10 flex items-center justify-center">
            <ShieldAlert className="h-10 w-10 text-[#ED4245]" />
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#060607] dark:text-white mb-2">
          アクセス権限がありません
        </h1>
        <p className="text-[#4E5058] dark:text-[#B5BAC1] text-sm mb-8">
          お探しのページは、ログイン済みのユーザーのみアクセス可能です。Discordアカウントでログインして再度お試しください。
        </p>

        <div className="flex flex-col gap-3">
          <Button
            asChild
            className="w-full h-11 bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium transition-colors"
          >
            <Link href="/api/auth/signin">ログインする</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="w-full h-11 text-[#4E5058] dark:text-[#DBDEE1] hover:bg-gray-100 dark:hover:bg-[#313338]"
          >
            <Link href="/">トップページに戻る</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
