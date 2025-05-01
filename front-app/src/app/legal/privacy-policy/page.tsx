import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Privacy() {
  return (
    <div className="container mx-auto p-2 sm:p-4 md:p-6">
      <Card className="max-w-[95%] sm:max-w-[90%] md:max-w-[80%] mx-auto">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl md:text-3xl">
            プライバシーポリシー
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            最終更新日: 2024年2月16日
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm sm:text-base">
          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
              1. 収集する情報
            </h2>
            <Separator className="my-2" />
            <p>当Botは以下の情報を収集します：</p>
            <ul className="list-disc pl-4 sm:pl-6">
              <li>Discordユーザー情報（ユーザーID、ユーザー名）</li>
              <li>サーバー情報（サーバーID、チャンネルID、ロール情報）</li>
              <li>時報設定データ（配信時間、配信チャンネル）</li>
              <li>ゲーム関連データ（所持金、ゲーム実績）</li>
              <li>ユーザーの設定</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
              2. 情報の利用目的
            </h2>
            <Separator className="my-2" />
            <ul className="list-disc pl-4 sm:pl-6">
              <li>時報機能の提供（定時メッセージの配信）</li>
              <li>
                ゲーム機能の提供（コインフリップ、おみくじ、所持金システム）
              </li>
              <li>サーバー管理機能の提供</li>
              <li>ユーザー体験の向上とカスタマイズ</li>
              <li>システムの不具合対応とパフォーマンス改善</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
              3. データの保管とセキュリティ
            </h2>
            <Separator className="my-2" />
            <ul className="list-disc pl-4 sm:pl-6">
              <li>データはPostgreSQLDBで安全に保管</li>
              <li>SSL/TLS暗号化による通信の保護</li>
              <li>定期的なバックアップの実施</li>
              <li>アクセス権限の厳格な管理</li>
              <li>セキュリティ監査の定期的な実施</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
              4. ユーザーの権利
            </h2>
            <Separator className="my-2" />
            <ul className="list-disc pl-4 sm:pl-6">
              <li>保存データの開示請求権</li>
              <li>データの訂正・削除要求権</li>
              <li>サービス利用の停止権</li>
              <li>設定の変更権</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
              5. データの保持期間と削除
            </h2>
            <Separator className="my-2" />
            <ul className="list-disc pl-4 sm:pl-6">
              <li>Botのサーバー退会時、即時に関連データの削除を行います</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
              6. 第三者提供
            </h2>
            <Separator className="my-2" />
            <p>
              以下の場合を除き、収集した情報を第三者に提供することはありません：
            </p>
            <ul className="list-disc pl-4 sm:pl-6">
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>サービス運営に必要な外部サービスとの連携</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
              7. お問い合わせ
            </h2>
            <Separator className="my-2" />
            <p>
              プライバシーポリシーに関するお問い合わせは、以下の方法で受け付けています：
            </p>
            <ul className="list-disc pl-4 sm:pl-6">
              <li>Discord: サポートサーバーでのお問い合わせ</li>
              <li>GitHub: Issue作成による報告</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
              8. ポリシーの更新
            </h2>
            <Separator className="my-2" />
            <p>
              本ポリシーは、サービスの変更や法令の改正に応じて適宜更新されます。重要な変更がある場合は、Discordサーバーでの告知で報告いたします。
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
