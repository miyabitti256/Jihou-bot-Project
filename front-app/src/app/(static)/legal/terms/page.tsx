import { FileText } from "lucide-react";
import Link from "next/link";

export default function Terms() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#313338]">
      <div className="container mx-auto p-4 sm:p-6 md:py-12 md:max-w-4xl">
        <div className="mb-10 border-b border-gray-200 dark:border-white/10 pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#5865F2]/10 flex items-center justify-center text-[#5865F2]">
              <FileText className="w-5 h-5" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#060607] dark:text-white tracking-tight">
              利用規約
            </h1>
          </div>
          <p className="text-sm text-[#4E5058] dark:text-[#949BA4] ml-13">
            最終更新日: 2024年2月16日
          </p>
        </div>

        <div className="space-y-10 text-[#4E5058] dark:text-[#DBDEE1] text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#060607] dark:text-white mb-4">
              1. サービスの概要
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                時報Bot（以下「本Bot」）は、Discord上で時報配信、ミニゲーム、その他の機能を提供するサービスです
              </li>
              <li>
                本Botの全機能は利用料金を頂戴することなく、無料で提供されます
              </li>
              <li>サービス内容は予告なく変更される場合があります</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#060607] dark:text-white mb-4">
              2. 利用条件
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Discordの利用規約に準拠していること</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#060607] dark:text-white mb-4">
              3. 時報機能について
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Botが参加しているサーバーメンバーのみが設定可能</li>
              <li>不適切なメッセージの配信は禁止</li>
              <li>スパム行為とみなされる利用は禁止</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#060607] dark:text-white mb-4">
              4. ゲーム機能について
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>ゲーム内通貨は現実の通貨価値を持ちません</li>
              <li>不正な方法での通貨獲得は禁止</li>
              <li>通貨の譲渡・売買は禁止</li>
              <li>運営判断により残高の調整を行う場合があります</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#060607] dark:text-white mb-4">
              5. 禁止事項
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>本Botの機能の悪用</li>
              <li>他のユーザーへの迷惑行為</li>
              <li>サービスの運営を妨害する行為</li>
              <li>不正アクセスの試み</li>
              <li>Botのクローンや複製の作成</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#060607] dark:text-white mb-4">
              6. サービスの停止・制限
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>メンテナンスによるサービス停止</li>
              <li>不正利用者へのサービス制限</li>
              <li>Discord APIの制限によるサービス制限</li>
              <li>予期せぬ技術的問題による停止</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#060607] dark:text-white mb-4">
              7. 免責事項
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>本Botの利用により生じた損害</li>
              <li>データの損失や消失</li>
              <li>第三者との紛争</li>
              <li>サービス停止による影響</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#060607] dark:text-white mb-4">
              8. 規約の変更
            </h2>
            <p>
              本規約は予告なく変更される場合があります。重要な変更については、Discordサーバーで告知いたします。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#060607] dark:text-white mb-4">
              9. お問い合わせ
            </h2>
            <p className="mb-2">ご不明な点は以下をご確認ください：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-[#006CE7] dark:text-[#00A8FC] hover:underline font-medium"
                >
                  使い方ガイド
                </Link>
              </li>
              <li>GitHubのREADME</li>
              <li>サポートサーバーでのお問い合わせ</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
