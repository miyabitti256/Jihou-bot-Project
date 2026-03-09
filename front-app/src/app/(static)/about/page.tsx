import { Bot, Coins, Gamepad2, Terminal } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white dark:bg-[#313338]">
      <main className="max-w-3xl mx-auto px-4 py-12 md:py-20">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[#5865F2] flex items-center justify-center shadow-lg">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#060607] dark:text-white tracking-tight">
              時報Botについて
            </h1>
            <p className="text-[#4E5058] dark:text-[#B5BAC1] mt-1 text-lg">
              サーバーを便利で楽しくする、Jihou Botの使い方ガイド
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Terminal className="w-6 h-6 text-[#5865F2]" />
              <h2 className="text-2xl font-bold text-[#060607] dark:text-white">
                コマンド一覧
              </h2>
            </div>

            <div className="space-y-4">
              {/* Command: setschedule */}
              <div className="bg-[#F2F3F5] dark:bg-[#2B2D31] rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden transition-colors hover:border-[#5865F2]/30">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg text-[#060607] dark:text-white">
                      /setschedule
                    </span>
                    <span className="text-xs font-semibold px-2 py-1 rounded-md bg-[#5865F2]/10 text-[#5865F2]">
                      時報機能
                    </span>
                  </div>
                  <p className="text-[#4E5058] dark:text-[#DBDEE1] mb-4">
                    時報を追加します。コマンドを実行したチャンネルに送信されます。
                  </p>
                  <div className="bg-white dark:bg-[#1E1F22] rounded-lg p-4 border border-gray-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-[#4E5058] dark:text-[#949BA4] uppercase tracking-wider mb-2">
                      オプション
                    </h4>
                    <ul className="space-y-2 text-sm text-[#060607] dark:text-[#DBDEE1]">
                      <li className="flex items-start gap-2">
                        <span className="font-mono text-[#006CE7] dark:text-[#00A8FC] shrink-0 mt-0.5">
                          time
                        </span>
                        <span>
                          <span className="text-[#ED4245] text-xs font-bold mr-1">
                            必須
                          </span>{" "}
                          追加する時報の時刻 HH:MMの形式 (例: 12:00)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-mono text-[#006CE7] dark:text-[#00A8FC] shrink-0 mt-0.5">
                          message
                        </span>
                        <span className="text-[#4E5058] dark:text-[#B5BAC1]">
                          追加する時報のメッセージ
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Command: editschedule */}
              <div className="bg-[#F2F3F5] dark:bg-[#2B2D31] rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden transition-colors hover:border-[#5865F2]/30">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg text-[#060607] dark:text-white">
                      /editschedule
                    </span>
                    <span className="text-xs font-semibold px-2 py-1 rounded-md bg-[#5865F2]/10 text-[#5865F2]">
                      時報機能
                    </span>
                  </div>
                  <p className="text-[#4E5058] dark:text-[#DBDEE1] mb-4">
                    既存の時報を編集します。
                  </p>
                  <div className="bg-white dark:bg-[#1E1F22] rounded-lg p-4 border border-gray-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-[#4E5058] dark:text-[#949BA4] uppercase tracking-wider mb-2">
                      オプション
                    </h4>
                    <ul className="space-y-2 text-sm text-[#060607] dark:text-[#DBDEE1]">
                      <li className="flex items-center gap-2">
                        <span className="font-mono text-[#006CE7] dark:text-[#00A8FC]">
                          id
                        </span>
                        <span>
                          <span className="text-[#ED4245] text-xs font-bold mr-1">
                            必須
                          </span>{" "}
                          編集する時報のID
                        </span>
                      </li>
                      <li className="flex gap-4 text-[#4E5058] dark:text-[#B5BAC1] mt-2 text-xs">
                        <span>
                          • <span className="font-mono">time</span>
                        </span>
                        <span>
                          • <span className="font-mono">message</span>
                        </span>
                        <span>
                          • <span className="font-mono">channel</span>
                        </span>
                        <span>
                          • <span className="font-mono">isactive</span>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Command: deleteschedule */}
              <div className="bg-[#F2F3F5] dark:bg-[#2B2D31] rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden transition-colors hover:border-[#5865F2]/30">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg text-[#060607] dark:text-white">
                      /deleteschedule
                    </span>
                    <span className="text-xs font-semibold px-2 py-1 rounded-md bg-[#ED4245]/10 text-[#ED4245]">
                      時報機能
                    </span>
                  </div>
                  <p className="text-[#4E5058] dark:text-[#DBDEE1] mb-4">
                    設定済みの時報を削除します。
                  </p>
                  <div className="bg-white dark:bg-[#1E1F22] rounded-lg p-4 border border-gray-100 dark:border-white/5">
                    <ul className="text-sm text-[#060607] dark:text-[#DBDEE1]">
                      <li className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-[#006CE7] dark:text-[#00A8FC]">
                          id
                        </span>
                        <span>
                          <span className="text-[#ED4245] text-xs font-bold mr-1">
                            必須
                          </span>{" "}
                          削除する時報のID
                        </span>
                      </li>
                    </ul>
                    <p className="text-xs text-[#4E5058] dark:text-[#949BA4]">
                      ※ idは{" "}
                      <code className="bg-[#E3E5E8] dark:bg-[#2B2D31] px-1 py-0.5 rounded font-mono">
                        /scheduleinfo
                      </code>{" "}
                      コマンドで確認できます。
                    </p>
                  </div>
                </div>
              </div>

              {/* Command: scheduleinfo */}
              <div className="bg-[#F2F3F5] dark:bg-[#2B2D31] rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden transition-colors hover:border-[#5865F2]/30">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg text-[#060607] dark:text-white">
                      /scheduleinfo
                    </span>
                    <span className="text-xs font-semibold px-2 py-1 rounded-md bg-[#5865F2]/10 text-[#5865F2]">
                      時報機能
                    </span>
                  </div>
                  <p className="text-[#4E5058] dark:text-[#DBDEE1]">
                    現在設定されている時報の一覧と詳細情報を表示します。
                  </p>
                </div>
              </div>

              {/* Minigames Settings */}
              <div className="flex items-center gap-2 mt-12 mb-6 pt-8 border-t border-gray-200 dark:border-white/10">
                <Gamepad2 className="w-6 h-6 text-[#57F287]" />
                <h2 className="text-2xl font-bold text-[#060607] dark:text-white">
                  ミニゲーム
                </h2>
              </div>

              {/* Command: omikuji */}
              <div className="bg-[#F2F3F5] dark:bg-[#2B2D31] rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden transition-colors hover:border-[#5865F2]/30">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg text-[#060607] dark:text-white">
                      /omikuji
                    </span>
                    <span className="text-xs font-semibold px-2 py-1 rounded-md bg-[#57F287]/10 text-[#57F287]">
                      ゲーム
                    </span>
                  </div>
                  <p className="text-[#4E5058] dark:text-[#DBDEE1] mb-4">
                    おみくじを引いて運試し！結果によってゲーム内通貨が増減します。
                  </p>
                  <div className="bg-white dark:bg-[#1E1F22] rounded-lg p-4 border border-gray-100 dark:border-white/5">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#57F287]">
                          大吉 (8%)
                        </span>
                        <span className="text-xs text-[#4E5058] dark:text-[#949BA4]">
                          +1000円
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#57F287]">
                          吉 (12%)
                        </span>
                        <span className="text-xs text-[#4E5058] dark:text-[#949BA4]">
                          +500円
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#FEE75C]">
                          中吉/小吉/末吉
                        </span>
                        <span className="text-xs text-[#4E5058] dark:text-[#949BA4]">
                          +100円〜300円
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#ED4245]">
                          凶/大凶
                        </span>
                        <span className="text-xs text-[#4E5058] dark:text-[#949BA4]">
                          -50円〜-100円
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Command: coinflip */}
              <div className="bg-[#F2F3F5] dark:bg-[#2B2D31] rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden transition-colors hover:border-[#5865F2]/30">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg text-[#060607] dark:text-white">
                      /coinflip
                    </span>
                    <span className="text-xs font-semibold px-2 py-1 rounded-md bg-[#57F287]/10 text-[#57F287]">
                      ゲーム
                    </span>
                  </div>
                  <p className="text-[#4E5058] dark:text-[#DBDEE1] mb-4">
                    所持金をコイントスで賭けるゲームです。勝利すると賭け金が2倍になります。
                  </p>
                  <div className="bg-white dark:bg-[#1E1F22] rounded-lg p-3 border border-gray-100 dark:border-white/5 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-[#FEE75C]" />
                    <span className="text-sm font-mono text-[#006CE7] dark:text-[#00A8FC]">
                      bet
                    </span>
                    <span className="text-sm text-[#060607] dark:text-[#DBDEE1] ml-2">
                      賭けるお金（1円〜10000円）
                    </span>
                  </div>
                </div>
              </div>

              {/* Command: janken */}
              <div className="bg-[#F2F3F5] dark:bg-[#2B2D31] rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden transition-colors hover:border-[#5865F2]/30">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg text-[#060607] dark:text-white">
                      /janken
                    </span>
                    <span className="text-xs font-semibold px-2 py-1 rounded-md bg-[#57F287]/10 text-[#57F287]">
                      ゲーム
                    </span>
                  </div>
                  <p className="text-[#4E5058] dark:text-[#DBDEE1]">
                    対戦相手を募集してユーザー同士でじゃんけんバトルをします。
                    <code className="font-mono text-xs bg-[#E3E5E8] dark:bg-[#1E1F22] px-1 py-0.5 rounded ml-1">
                      bet
                    </code>{" "}
                    オプションで賭け金を指定することも可能です。
                  </p>
                </div>
              </div>

              {/* Command: botjanken */}
              <div className="bg-[#F2F3F5] dark:bg-[#2B2D31] rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden transition-colors hover:border-[#5865F2]/30">
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-lg text-[#060607] dark:text-white">
                      /botjanken
                    </span>
                    <span className="text-xs font-semibold px-2 py-1 rounded-md bg-[#57F287]/10 text-[#57F287]">
                      ゲーム
                    </span>
                  </div>
                  <p className="text-[#4E5058] dark:text-[#DBDEE1]">
                    時報Bot相手にじゃんけんを挑みます。負けると煽られます。
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
