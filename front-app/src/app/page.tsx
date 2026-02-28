import Image from "next/image";
import Link from "next/link";
import { DigitalClock } from "@/components/digitalClock";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center text-center space-y-6">
        <Image
          src="/images/clock-2.png"
          alt="時報Bot"
          width={150}
          height={150}
          className="mb-4"
          priority
          fetchPriority="high"
        />
        <h1 className="text-4xl font-bold mb-4">Discord 時報Bot</h1>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 my-8">
          <div className="flex flex-col items-center gap-2">
            <DigitalClock />
          </div>
        </div>

        <p className="text-xl mb-6">
          一日に一度、指定の時刻にメッセージを送信するBotです。
        </p>
        <p className="text-xl mb-6">
          テキストチャンネルやこのサイトでミニゲームも遊べるよ！
        </p>

        <Link
          href="https://discord.com/oauth2/authorize?client_id=1293583305794392084&permissions=2415930432&integration_type=0&scope=bot"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Botを招待する
        </Link>

        <div className="mt-12 text-left">
          <h2 className="text-2xl font-bold mb-4">主な機能</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>指定時刻にメッセージを送信</li>
            <li>カスタムメッセージの設定</li>
            <li>複数チャンネルへの対応</li>
            <li>ミニゲームのプレイ</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
