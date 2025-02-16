import { Separator } from "@/components/ui/separator"
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"

export default function Terms() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>利用規約</CardTitle>
          <CardDescription>最終更新日: 2025年2月16日</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h2 className="text-xl font-bold">1. サービスの利用について</h2>
            <Separator className="my-2" />
            <p>本Botは、このサイト上やBotが参加しているDiscordサーバーで、ミニゲーム（コインフリップ、おみくじなど）や定期メッセージ機能を提供します。</p>
          </section>

          <section>
            <h2 className="text-xl font-bold">2. ゲーム内通貨について</h2>
            <Separator className="my-2" />
            <p>・ゲーム内通貨は現実の通貨ではありません</p>
            <p>・ゲーム内でのみ使用することができます</p>
            <p>・不正な方法での通貨獲得は禁止されています</p>
          </section>

          <section>
            <h2 className="text-xl font-bold">3. 定期メッセージ機能について</h2>
            <Separator className="my-2" />
            <p>・スケジュールされたメッセージはbotが参加しているサーバーのメンバーのみ追加・編集・削除が可能です</p>
            <p>・不適切なコンテンツの投稿は禁止されています</p>
          </section>

          <section>
            <h2 className="text-xl font-bold">4. 使い方について</h2>
            <Separator className="my-2" />
            <p>・<Link href={"/about"}>About</Link>ページや、GitHubのreadme.mdに記載されています</p>
            <p>・不明な点があれば、開発者にお問い合わせください</p>
          </section>

          <section>
            <h2 className="text-xl font-bold">5. 禁止事項</h2>
            <Separator className="my-2" />
            <p>・Botの機能の悪用</p>
            <p>・サービスの運営を妨害する行為</p>
            <p>・他のユーザーへの迷惑行為</p>
          </section>

          <section>
            <h2 className="text-xl font-bold">5. 免責事項</h2>
            <Separator className="my-2" />
            <p>・本Botのサービス提供の中断や停止</p>
            <p>・ユーザーデータの損失</p>
            <p>・その他本Botの使用により生じた損害について、開発者は責任を負いません</p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
