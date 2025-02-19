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
    <div className="container mx-auto p-2 sm:p-4 md:p-6">
      <Card className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl md:text-3xl">利用規約</CardTitle>
          <CardDescription className="text-sm sm:text-base">最終更新日: 2024年2月16日</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm sm:text-base">
          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">1. サービスの概要</h2>
            <Separator className="my-2" />
            <ul className="list-disc pl-4 sm:pl-6">
              <li>時報Bot（以下「本Bot」）は、Discord上で時報配信、ミニゲーム、その他の機能を提供するサービスです</li>
              <li>本Botの全機能は利用料金を頂戴することなく、無料で提供されます</li>
              <li>サービス内容は予告なく変更される場合があります</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">2. 利用条件</h2>
            <Separator className="my-2" />
            <ul className="list-disc pl-4 sm:pl-6">
              <li>Discordの利用規約に準拠していること</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">3. 時報機能について</h2>
            <Separator className="my-2" />
            <ul className="list-disc pl-4 sm:pl-6">
              <li>Botが参加しているサーバーメンバーのみが設定可能</li>
              <li>不適切なメッセージの配信は禁止</li>
              <li>スパム行為とみなされる利用は禁止</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">4. ゲーム機能について</h2>
            <Separator className="my-2" />
            <ul className="list-disc pl-4 sm:pl-6">
              <li>ゲーム内通貨は現実の通貨価値を持ちません</li>
              <li>不正な方法での通貨獲得は禁止</li>
              <li>通貨の譲渡・売買は禁止</li>
              <li>運営判断により残高の調整を行う場合があります</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">5. 禁止事項</h2>
            <Separator className="my-2" />
            <ul className="list-disc pl-4 sm:pl-6">
              <li>本Botの機能の悪用</li>
              <li>他のユーザーへの迷惑行為</li>
              <li>サービスの運営を妨害する行為</li>
              <li>不正アクセスの試み</li>
              <li>Botのクローンや複製の作成</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">6. サービスの停止・制限</h2>
            <Separator className="my-2" />
            <ul className="list-disc pl-4 sm:pl-6">
              <li>メンテナンスによるサービス停止</li>
              <li>不正利用者へのサービス制限</li>
              <li>Discord APIの制限によるサービス制限</li>
              <li>予期せぬ技術的問題による停止</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">7. 免責事項</h2>
            <Separator className="my-2" />
            <ul className="list-disc pl-4 sm:pl-6">
              <li>本Botの利用により生じた損害</li>
              <li>データの損失や消失</li>
              <li>第三者との紛争</li>
              <li>サービス停止による影響</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">8. 規約の変更</h2>
            <Separator className="my-2" />
            <p>本規約は予告なく変更される場合があります。重要な変更については、Discordサーバーで告知いたします。</p>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">9. お問い合わせ</h2>
            <Separator className="my-2" />
            <p>ご不明な点は以下をご確認ください：</p>
            <ul className="list-disc pl-4 sm:pl-6">
              <li><Link href="/about" className="text-blue-500 hover:underline">使い方ガイド</Link></li>
              <li>GitHubのREADME</li>
              <li>サポートサーバーでのお問い合わせ</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
