import { ShieldCheck } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#313338]">
      <div className="container mx-auto p-4 sm:p-6 md:py-12 md:max-w-4xl">
        <div className="mb-10 border-b border-gray-200 dark:border-white/10 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#57F287]/10 flex items-center justify-center text-[#57F287]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#060607] dark:text-white tracking-tight">
              プライバシーポリシー
            </h1>
          </div>
          <p className="text-sm text-[#4E5058] dark:text-[#949BA4] ml-13">
            最終更新日: 2024年2月16日
          </p>
        </div>

        <div className="space-y-10 text-[#4E5058] dark:text-[#DBDEE1] text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#060607] dark:text-white mb-4">
              1. 収集する情報
            </h2>
            <p className="mb-2">当Botは以下の情報を収集します：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Discordユーザー情報（ユーザーID、ユーザー名）</li>
              <li>サーバー情報（サーバーID、チャンネルID、ロール情報）</li>
              <li>時報設定データ（配信時間、配信チャンネル）</li>
              <li>ゲーム関連データ（所持金、ゲーム実績）</li>
              <li>ユーザーの設定</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#060607] dark:text-white mb-4">
              2. 情報の利用目的
            </h2>
            <ul className="list-disc pl-6 space-y-2">
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
            <h2 className="text-xl font-bold text-[#060607] dark:text-white mb-4">
              3. データの保管とセキュリティ
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>データはPostgreSQLDBで安全に保管</li>
              <li>SSL/TLS暗号化による通信の保護</li>
              <li>定期的なバックアップの実施</li>
              <li>アクセス権限の厳格な管理</li>
              <li>セキュリティ監査の定期的な実施</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#060607] dark:text-white mb-4">
              4. ユーザーの権利
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>保存データの開示請求権</li>
              <li>データの訂正・削除要求権</li>
              <li>サービス利用の停止権</li>
              <li>設定の変更権</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#060607] dark:text-white mb-4">
              5. データの保持期間と削除
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Botのサーバー退会時、即時に関連データの削除を行います</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#060607] dark:text-white mb-4">
              6. 第三者提供
            </h2>
            <p className="mb-2">
              以下の場合を除き、収集した情報を第三者に提供することはありません：
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>サービス運営に必要な外部サービスとの連携</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#060607] dark:text-white mb-4">
              7. お問い合わせ
            </h2>
            <p className="mb-2">
              プライバシーポリシーに関するお問い合わせは、以下の方法で受け付けています：
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Discord: サポートサーバーでのお問い合わせ</li>
              <li>GitHub: Issue作成による報告</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#060607] dark:text-white mb-4">
              8. ポリシーの更新
            </h2>
            <p>
              本ポリシーは、サービスの変更や法令の改正に応じて適宜更新されます。重要な変更がある場合は、Discordサーバーでの告知で報告いたします。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
