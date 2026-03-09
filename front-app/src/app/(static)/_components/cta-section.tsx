"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";

const INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1293583305794392084&permissions=2415930432&integration_type=0&scope=bot";

export function CtaSection() {
  return (
    <section className="w-full py-24 px-4 flex justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, type: "spring" }}
        className="relative overflow-hidden w-full max-w-5xl rounded-3xl bg-linear-to-br from-[#5865F2] to-[#4752C4] shadow-2xl p-10 md:p-16 text-center"
      >
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white opacity-10 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <Sparkles className="w-12 h-12 text-white/90 mb-6" />
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            あなたのサーバーにも導入しませんか？
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            セットアップは簡単です。今すぐBotを招待して、時報機能と楽しいミニゲームを始めましょう。
          </p>
          <Link href={INVITE_URL} target="_blank" rel="noopener noreferrer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#5865F2] font-bold text-xl py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all"
            >
              今すぐBotを導入する
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
