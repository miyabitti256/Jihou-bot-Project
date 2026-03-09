"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, LogIn } from "lucide-react";
import Link from "next/link";
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
                {/* Windows Minimize */}
                <div className="w-3 h-px bg-black/60 dark:bg-white/60" />
                {/* Windows Maximize */}
                <div className="w-3 h-3 border border-black/60 dark:border-white/60" />
                {/* Windows Close */}
                <div className="w-3 h-3 relative flex items-center justify-center">
                  <div className="absolute w-3 h-px bg-black/60 dark:bg-white/60 rotate-45" />
                  <div className="absolute w-3 h-px bg-black/60 dark:bg-white/60 -rotate-45" />
                </div>
              </div>
            </div>
            {/* Mock Dashboard Content Placeholder */}
            <div className="p-1 border-t border-transparent dark:border-white/5">
              {/* Fallback pattern showing a faux UI that supports light/dark mode */}
              <div className="aspect-4/3 bg-white dark:bg-[#313338] p-6 flex flex-col gap-4">
                <div className="flex gap-4 mb-4">
                  <div className="w-48 h-10 bg-gray-100 dark:bg-[#2B2D31] rounded-lg animate-pulse" />
                  <div className="w-24 h-10 bg-[#5865F2] rounded-lg ml-auto" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-32 bg-gray-100 dark:bg-[#2B2D31] rounded-xl animate-pulse" />
                  <div className="h-32 bg-gray-100 dark:bg-[#2B2D31] rounded-xl animate-pulse" />
                  <div className="h-48 col-span-2 bg-gray-100 dark:bg-[#2B2D31] rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
