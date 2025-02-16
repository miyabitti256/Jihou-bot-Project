export default function About() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">時報Botについて</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">コマンド一覧</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">/setschedule</h3>
              <p className="mb-2">時報を追加します コマンドを実行したチャンネルに送信されます</p>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">オプション：</h4>
                <ul className="list-disc list-inside">
                  <li>time: (必須) 追加する時報の時刻 HH:MMの形式 例: 12:00</li>
                  <li>message: (任意) 追加する時報のメッセージ</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">/scheduleinfo</h3>
              <p>時報の情報を表示します</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">/editschedule</h3>
              <p className="mb-2">時報を編集します</p>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">オプション：</h4>
                <ul className="list-disc list-inside">
                  <li>id: (必須) 編集する時報のID</li>
                  <li>time: (任意) 編集する時報の時刻</li>
                  <li>message: (任意) 送信するメッセージ</li>
                  <li>channel: (任意) 送信するチャンネルID</li>
                  <li>isactive: (任意) 時報のアクティブ状態 (true, false)</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">/omikuji</h3>
              <p className="mb-2">おみくじを引きます</p>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">確率：</h4>
                <ul className="list-disc list-inside">
                  <li>ぬべ吉: 1% (20000円)</li>
                  <li>大吉: 8% (1000円)</li>
                  <li>吉: 12% (500円)</li>
                  <li>中吉: 16% (300円)</li>
                  <li>小吉: 22% (200円)</li>
                  <li>末吉: 22% (100円)</li>
                  <li>凶: 12% (-50円)</li>
                  <li>大凶: 5% (-100円)</li>
                  <li>ヌベキチ└(՞ةڼ◔)」: 2% (-300円)</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">/coinflip</h3>
              <p className="mb-2">お金をコイントスで賭けます</p>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">オプション：</h4>
                <ul className="list-disc list-inside">
                  <li>bet: (必須) 賭けるお金（1円から10000円まで）</li>
                </ul>
                <p className="mt-2">勝利すると賭け金の2倍のお金がもらえます</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">/botjanken</h3>
              <p className="mb-2">時報Botとじゃんけんをします</p>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">オプション：</h4>
                <ul className="list-disc list-inside">
                  <li>出す手: (必須) じゃんけんで出す手を選択します</li>
                </ul>
                <p className="mt-2">負けると煽られます</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">/janken</h3>
              <p className="mb-2">対戦相手を募集してじゃんけんをします</p>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">オプション：</h4>
                <ul className="list-disc list-inside">
                  <li>bet: (必須) お金を賭けるかどうか</li>
                </ul>
                <p className="mt-2">賭けモードで開始した場合、賭け金は100,500,1000,5000,10000の中から選択します</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
