"use client";

import { motion, useInView } from "framer-motion";
import { LayoutDashboard, LogIn } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function DashboardSection() {
  return (
    <section className="w-full py-20 px-4 md:py-32">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex-1 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5865F2]/10 text-[#5865F2] font-semibold text-sm">
            <LayoutDashboard className="w-4 h-4" />
            Web Dashboard
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[#060607] dark:text-white">
            Webからも
            <br />
            カンタン操作
          </h2>
          <p className="text-lg text-[#4E5058] dark:text-[#B5BAC1] leading-relaxed">
            Discordでスラッシュコマンドを打たなくても、ブラウザから時報の設定や変更が可能です。
            分かりやすいGUIで、どのチャンネルへいつ送信するかを直感的に管理できます。
            また、Webダッシュボード上でもミニゲームなどの各種機能を利用できます。
          </p>
          <div className="pt-4">
            <Button
              asChild
              className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold px-8 py-6 rounded-xl shadow-md text-lg transition-transform hover:-translate-y-1"
            >
              <Link href="/login" className="flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                ログインして始める
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Image / Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 w-full"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#313338]">
            {/* Mock Windows Header */}
            <div className="bg-[#E3E5E8] dark:bg-[#2B2D31] px-4 py-2 flex items-center justify-between border-b border-gray-200 dark:border-black/20">
              <div className="text-xs font-medium text-[#4E5058] dark:text-[#949BA4] ml-2">
                Jihou-Bot Dashboard
              </div>
              <div className="flex gap-4 items-center mr-1">
                <div className="w-3 h-px bg-black/60 dark:bg-white/60" />
                <div className="w-3 h-3 border border-black/60 dark:border-white/60" />
                <div className="w-3 h-3 relative flex items-center justify-center">
                  <div className="absolute w-3 h-px bg-black/60 dark:bg-white/60 rotate-45" />
                  <div className="absolute w-3 h-px bg-black/60 dark:bg-white/60 -rotate-45" />
                </div>
              </div>
            </div>

            {/* Mock Dashboard Content */}
            <div className="border-t border-transparent dark:border-white/5 bg-gray-50 dark:bg-[#313338]">
              <div className="aspect-4/3 p-4 flex flex-col gap-3">
                <MockDashboardContent />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MockDashboardContent() {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1300);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  if (isLoading) {
    return (
      <div ref={containerRef} className="flex flex-col h-full w-full">
        <div className="flex justify-between items-center mb-2">
          <div className="w-48 h-8 bg-gray-200 dark:bg-[#2B2D31] rounded-md animate-pulse" />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white dark:bg-[#2B2D31] rounded-xl border border-gray-200 dark:border-white/5 h-40 animate-pulse" />
          <div className="bg-white dark:bg-[#2B2D31] rounded-xl border border-gray-200 dark:border-white/5 h-32 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full w-full"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          ユーザーのダッシュボード
        </h3>
      </div>

      <div className="flex flex-col gap-4">
        {/* Mock Scheduled Messages */}
        <div className="bg-white dark:bg-[#2B2D31] rounded-xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden flex flex-col">
          <div className="bg-[#F2F3F5] dark:bg-[#1E1F22] px-4 py-2.5 border-b border-gray-200 dark:border-black/20 shrink-0">
            <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">
              設定した時報一覧
            </h4>
          </div>
          <div className="p-3">
            <div className="flex items-center justify-between p-2.5 border-b border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#313338] rounded-md mb-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">M</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                      Main Server
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-[#949BA4]">
                      #general
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-[#DBDEE1]">
                    おはようございます！
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-medium text-gray-900 dark:text-gray-300">
                  08:00
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-green-100 text-green-700 dark:bg-[#23A559]/20 dark:text-[#23A559]">
                  有効
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-[#313338] rounded-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">W</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                      Work Space
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-[#949BA4]">
                      #announcements
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-[#DBDEE1]">
                    定例ミーティング開始5分前です。
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-medium text-gray-900 dark:text-gray-300">
                  14:55
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-green-100 text-green-700 dark:bg-[#23A559]/20 dark:text-[#23A559]">
                  有効
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mock Player Info */}
        <div className="bg-white dark:bg-[#2B2D31] rounded-xl shadow-sm border border-gray-200 dark:border-white/5 overflow-hidden flex flex-col">
          <div className="bg-[#F2F3F5] dark:bg-[#1E1F22] px-4 py-2.5 border-b border-gray-200 dark:border-black/20 shrink-0">
            <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100">
              プレイヤー情報
            </h4>
          </div>
          <div className="p-3 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-semibold text-gray-500 dark:text-[#949BA4] mb-1">
                現在の所持金
              </p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                5,000円
              </p>
            </div>
            <div className="flex gap-2">
              <div className="bg-gray-50 dark:bg-[#1E1F22] border border-gray-100 dark:border-white/5 rounded-lg p-2 flex flex-col items-center justify-center w-16">
                <p className="text-[8px] text-gray-500 dark:text-[#949BA4]">
                  勝率
                </p>
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  65.0%
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-[#1E1F22] border border-gray-100 dark:border-white/5 rounded-lg p-2 flex flex-col items-center justify-center w-16">
                <p className="text-[8px] text-gray-500 dark:text-[#949BA4]">
                  収支
                </p>
                <p className="text-xs font-bold text-green-600 dark:text-[#23A559]">
                  +1,500
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
