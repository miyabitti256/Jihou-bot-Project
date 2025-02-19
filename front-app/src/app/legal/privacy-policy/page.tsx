import { Separator } from "@/components/ui/separator"
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Privacy() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>プライバシーポリシー</CardTitle>
          <CardDescription>最終更新日: 2025年2月16日</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <section>
            <h2 className="text-xl font-bold">1. 収集する情報</h2>
            <Separator className="my-2" />
            <p>当Botは以下の情報を収集します：</p>
            <ul className="list-disc pl-6">
              <li>Discordユーザーのユーザーデータ</li>
              <li>ゲーム内通貨の残高情報</li>
              <li>スケジュールされたメッセージの内容とタイミング</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">2. 情報の利用目的</h2>
            <Separator className="my-2" />
            <ul className="list-disc pl-6">
              <li>ミニゲーム機能の提供（コインフリップ、おみくじ等）</li>
              <li>定期メッセージの配信</li>
              <li>ユーザーの所持金管理</li>
              <li>サービスの改善と新機能の開発</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">3. データの保管</h2>
            <Separator className="my-2" />
            <p>収集したデータは以下の方法で管理されます：</p>
            <ul className="list-disc pl-6">
              <li>安全なデータベースでの保管</li>
              <li>定期的なバックアップの実施</li>
              <li>アクセス制限の実施</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">4. ユーザーの権利</h2>
            <Separator className="my-2" />
            <ul className="list-disc pl-6">
              <li>保存されているデータの確認</li>
              <li>データの削除リクエスト</li>
              <li>データの訂正リクエスト</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">5. データの削除</h2>
            <Separator className="my-2" />
            <p>以下の場合にデータを削除します：</p>
            <ul className="list-disc pl-6">
              <li>ユーザーからの削除リクエスト</li>
              <li>サービス利用終了後の一定期間</li>
              <li>定期メッセージのスケジュール終了後</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">6. お問い合わせ</h2>
            <Separator className="my-2" />
            <p>プライバシーポリシーに関するお問い合わせは、管理者までご連絡ください。</p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
