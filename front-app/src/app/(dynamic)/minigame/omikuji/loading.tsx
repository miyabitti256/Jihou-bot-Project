import { Sparkles } from "lucide-react";

export default function OmikujiLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] p-4">
      {/* 待機中のワクワク感を演出するアニメーション（表示時間が短いため文字は省略） */}
      <div className="relative flex items-center justify-center">
        {/* 外側の波紋エフェクト */}
        <div
          className="absolute w-32 h-32 bg-indigo-500/20 dark:bg-indigo-400/20 rounded-full animate-ping"
          style={{ animationDuration: "1s" }}
        />
        <div
          className="absolute w-24 h-24 bg-indigo-500/40 dark:bg-indigo-400/30 rounded-full animate-ping"
          style={{ animationDuration: "1.5s", animationDelay: "0.2s" }}
        />

        {/* 中央のアニメーションアイコン */}
        <div className="relative z-10 w-20 h-20 bg-linear-to-tr from-indigo-500 to-purple-500 rounded-full shadow-lg shadow-indigo-500/30 flex items-center justify-center animate-bounce">
          <Sparkles className="w-10 h-10 text-white animate-pulse" />
        </div>
      </div>
    </div>
  );
}
