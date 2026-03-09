import { ExternalLink, HelpCircle } from "lucide-react";
import Link from "next/link";
import { FaDiscord, FaGithub } from "react-icons/fa";

export default function Contact() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#313338]">
      <main className="max-w-2xl mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="w-16 h-16 rounded-full bg-[#5865F2]/10 flex items-center justify-center mb-4 text-[#5865F2]">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#060607] dark:text-white tracking-tight mb-4">
            お問い合わせ
          </h1>
          <p className="text-lg text-[#4E5058] dark:text-[#B5BAC1] max-w-lg">
            時報Botに関するご質問・ご要望・不具合報告がございましたら、以下の連絡先までお気軽にお問い合わせください。
          </p>
        </div>

        <div className="space-y-6">
          {/* Discord Server Link */}
          <Link
            href="https://discord.gg/Zxc9y3xdpy"
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-[#F2F3F5] dark:bg-[#2B2D31] hover:bg-[#E3E5E8] dark:hover:bg-[#1E1F22] p-6 rounded-2xl border border-gray-200 dark:border-white/5 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#5865F2] flex items-center justify-center shrink-0 text-white group-hover:scale-110 transition-transform">
                <FaDiscord className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#060607] dark:text-white mb-1 flex items-center gap-2">
                  公式Discordサーバー
                  <ExternalLink className="w-4 h-4 text-[#4E5058] dark:text-[#949BA4] opacity-0 group-hover:opacity-100 transition-opacity" />
                </h2>
                <p className="text-sm text-[#4E5058] dark:text-[#B5BAC1]">
                  サポートや不具合報告、最新情報のお知らせはこちら
                </p>
              </div>
            </div>
          </Link>

          {/* GitHub Link */}
          <Link
            href="https://github.com/miyabitti256/Jihou-bot-Project"
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-[#F2F3F5] dark:bg-[#2B2D31] hover:bg-[#E3E5E8] dark:hover:bg-[#1E1F22] p-6 rounded-2xl border border-gray-200 dark:border-white/5 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#313338] dark:bg-white flex items-center justify-center shrink-0 text-white dark:text-[#313338] group-hover:scale-110 transition-transform">
                <FaGithub className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#060607] dark:text-white mb-1 flex items-center gap-2">
                  GitHub Repository
                  <ExternalLink className="w-4 h-4 text-[#4E5058] dark:text-[#949BA4] opacity-0 group-hover:opacity-100 transition-opacity" />
                </h2>
                <p className="text-sm text-[#4E5058] dark:text-[#B5BAC1]">
                  ソースコードの確認やIssuesの登録はこちらから
                </p>
              </div>
            </div>
          </Link>

          <div className="pt-8 text-center">
            <p className="inline-flex items-center px-4 py-2 rounded-md bg-[#FEE75C]/10 text-[#B8860B] dark:text-[#FEE75C] text-sm font-semibold">
              ※
              お問い合わせの内容により、返信までにお時間をいただく場合がございます。あらかじめご了承ください。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
