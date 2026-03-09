"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Bot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useState } from "react";

const INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1293583305794392084&permissions=2415930432&integration_type=0&scope=bot";

interface HeroSectionProps {
  clock: ReactNode;
}

export function HeroSection({ clock }: HeroSectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative w-full flex flex-col items-center justify-center py-20 px-4 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#5865F2]/20 blur-[120px]" />
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#5865F2]/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center text-center space-y-8 max-w-4xl"
      >
        <motion.div
          className="relative w-full max-w-[420px] h-[160px] mx-auto flex items-center justify-center cursor-pointer"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          onFocus={() => setIsHovered(true)}
          onBlur={() => setIsHovered(false)}
          tabIndex={0}
          role="region"
          aria-label="Bot Demo Animation"
        >
          <AnimatePresence>
            {!isHovered ? (
              <motion.div
                key="large-icon"
                layoutId="hero-avatar"
                className="absolute z-20 flex items-center justify-center w-40 h-40"
                initial={{
                  filter: "drop-shadow(0px 0px 0px rgba(0, 0, 0, 0))",
                }}
                animate={{
                  filter: "drop-shadow(0px 25px 25px rgba(0, 0, 0, 0.15))",
                }}
                exit={{ filter: "drop-shadow(0px 0px 0px rgba(0, 0, 0, 0))" }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <Image
                  src="/images/clock-2.png"
                  alt="時報Bot"
                  fill
                  sizes="160px"
                  className="object-contain hover:scale-105 transition-transform duration-300"
                  priority
                  fetchPriority="high"
                />
              </motion.div>
            ) : (
              <motion.div
                key="mock-container"
                className="absolute z-10 w-full h-full flex items-center justify-center"
              >
                {/* Mock Window Background - Fades out on exit */}
                <motion.div
                  key="mock-window-bg"
                  className="absolute z-10 w-full bg-white dark:bg-[#313338] shadow-2xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Mock Windows Header */}
                  <div className="bg-[#E3E5E8] dark:bg-[#2B2D31] px-3 py-2 flex items-center justify-between border-b border-gray-200 dark:border-black/20">
                    <div className="text-xs font-semibold text-[#4E5058] dark:text-[#949BA4]">
                      general - Discord
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="w-2.5 h-px bg-black/60 dark:bg-white/60" />
                      <div className="w-2.5 h-2.5 border border-black/60 dark:border-white/60" />
                      <div className="w-2.5 h-2.5 relative flex items-center justify-center">
                        <div className="absolute w-2.5 h-px bg-black/60 dark:bg-white/60 rotate-45" />
                        <div className="absolute w-2.5 h-px bg-black/60 dark:bg-white/60 -rotate-45" />
                      </div>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="p-4 flex items-start gap-4">
                    {/* Placeholder for the layoutId avatar */}
                    <div className="w-10 h-10 shrink-0" />
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#060607] dark:text-white leading-none">
                          時報G
                        </span>
                        <span className="bg-[#5865F2] text-white text-[10px] px-1 rounded flex items-center gap-0.5 font-bold leading-none h-4">
                          アプリ
                        </span>
                        <span className="text-xs text-[#4E5058] dark:text-[#949BA4] leading-none">
                          22:22
                        </span>
                      </div>
                      <div className="text-[#060607] dark:text-[#DBDEE1] mt-1 text-sm md:text-base">
                        22時22分をお知らせします
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Avatar positioned structurally via an invisible skeleton to guarantee pixel-perfect alignment, NOT fading on exit */}
                <div className="absolute z-20 w-full rounded-xl border border-transparent pointer-events-none">
                  {/* Invisible Header Replica */}
                  <div className="px-3 py-2 flex items-center justify-between border-b border-transparent">
                    <div className="text-xs font-semibold opacity-0">
                      general - Discord
                    </div>
                    <div className="flex gap-3 items-center opacity-0">
                      <div className="w-2.5 h-px" />
                      <div className="w-2.5 h-2.5 border" />
                      <div className="w-2.5 h-2.5 relative flex items-center justify-center">
                        <div className="absolute w-2.5 h-px" />
                        <div className="absolute w-2.5 h-px" />
                      </div>
                    </div>
                  </div>

                  {/* Message Content Replica */}
                  <div className="p-4 flex items-start gap-4">
                    <motion.div
                      key="small-icon"
                      layoutId="hero-avatar"
                      className="w-10 h-10 shrink-0 relative"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    >
                      <Image
                        src="/images/clock-2.png"
                        alt="時報Bot"
                        fill
                        className="object-contain"
                      />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#060607] dark:text-white">
            Discord <span className="text-[#5865F2]">時報Bot</span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-[#4E5058] dark:text-[#B5BAC1] max-w-2xl mx-auto leading-relaxed">
            一日に一度、指定の時刻にメッセージを送信。テキストチャンネルやWebでミニゲームも遊べる便利なBotで、サーバーをもっと楽しく。
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
          <Link href={INVITE_URL} target="_blank" rel="noopener noreferrer">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white text-lg font-bold py-4 px-8 rounded-full shadow-lg transition-colors"
            >
              <Bot className="w-6 h-6" />
              Botを招待する
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="pt-12"
        >
          <div className="p-6 bg-white dark:bg-[#2B2D31] rounded-2xl shadow-xl dark:shadow-none border border-gray-100 dark:border-white/5">
            {clock}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
