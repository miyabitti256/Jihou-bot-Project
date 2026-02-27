import Link from "next/link";
import { FaDiscord, FaGithub } from "react-icons/fa";

export default function Contact() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">お問い合わせ</h1>

      <div className="space-y-6">
        <p className="text-lg">
          時報Botに関するご質問・ご要望・不具合報告がございましたら、以下の連絡先までお気軽にお問い合わせください。
        </p>

        <div className="space-y-4">
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <FaDiscord className="text-[#5865F2]" />
              Discordサーバー
            </h2>
            <Link
              href="https://discord.gg/Zxc9y3xdpy"
              className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              時報G お知らせサーバー
            </Link>
          </div>

          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
              <FaGithub />
              GitHub
            </h2>
            <Link
              href="https://github.com/miyabitti256"
              className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              @miyabitti256
            </Link>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              ソースコードは
              <Link
                href="https://github.com/miyabitti256/Jihou-bot-Project"
                className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
              で公開しています
            </p>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mt-8">
          ※ 返信までお時間をいただく場合がございます。あらかじめご了承ください。
        </p>
      </div>
    </main>
  );
}
