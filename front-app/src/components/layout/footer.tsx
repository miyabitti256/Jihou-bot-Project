import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="w-full bg-[#F2F3F5] dark:bg-[#1E1F22] border-t border-gray-200 dark:border-white/5 transition-colors">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-xl font-extrabold text-[#060607] dark:text-white">
              <span className="text-[#5865F2]">時報</span>Bot
            </div>
            <p className="text-sm text-[#4E5058] dark:text-[#949BA4]">
              Discordサーバーをもっと便利に、もっと楽しく。
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
            <Button
              variant="link"
              className="text-[#4E5058] dark:text-[#949BA4] hover:text-[#060607] dark:hover:text-white"
              asChild
            >
              <Link href="/">ホーム</Link>
            </Button>
            <Button
              variant="link"
              className="text-[#4E5058] dark:text-[#949BA4] hover:text-[#060607] dark:hover:text-white"
              asChild
            >
              <Link href="/legal/terms">利用規約</Link>
            </Button>
            <Button
              variant="link"
              className="text-[#4E5058] dark:text-[#949BA4] hover:text-[#060607] dark:hover:text-white"
              asChild
            >
              <Link href="/legal/privacy-policy">プライバシーポリシー</Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#E3E5E8] dark:border-[#2B2D31] flex justify-between items-center flex-col md:flex-row gap-4">
          <p className="text-sm font-medium text-[#4E5058] dark:text-[#949BA4]">
            © {new Date().getFullYear()} miyabitti. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
