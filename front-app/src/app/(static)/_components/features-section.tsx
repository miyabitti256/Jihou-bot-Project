"use client";

import { motion } from "framer-motion";
import { Clock, Gamepad2, Settings, Users } from "lucide-react";

export function FeaturesSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 100 },
    },
  };

  const features = [
    {
      title: "毎日決まった時間に",
      description:
        "指定した時刻に自動でメッセージを送信します。リマインダーや毎日の挨拶に最適です。",
      icon: <Clock className="w-8 h-8 text-[#5865F2]" />,
    },
    {
      title: "自由なメッセージ設定",
      description:
        "送信するメッセージは自由にカスタマイズ可能！サーバーの雰囲気に合わせて調整できます。",
      icon: <Settings className="w-8 h-8 text-[#5865F2]" />,
    },
    {
      title: "複数チャンネル対応",
      description:
        "複数のテキストチャンネルにそれぞれ違う時報をセットすることが可能です。",
      icon: <Users className="w-8 h-8 text-[#5865F2]" />,
    },
    {
      title: "楽しいミニゲーム",
      description:
        "ジャンケンやおみくじ、コインフリップなど、ちょっとしたミニゲーム機能も搭載してます。",
      icon: <Gamepad2 className="w-8 h-8 text-[#5865F2]" />,
    },
  ];

  return (
    <section className="w-full py-20 px-4 md:py-24 bg-[#F2F3F5] dark:bg-[#2B2D31] rounded-3xl my-8">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-[#060607] dark:text-white mb-4">
            主な機能
          </h2>
          <p className="text-lg text-[#4E5058] dark:text-[#B5BAC1] max-w-2xl mx-auto">
            時報Botには、他にもサーバーを盛り上げる様々な機能が備わっています。
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              whileHover={{ scale: 1.02 }}
              className="flex flex-col p-8 bg-white dark:bg-[#1E1F22] rounded-2xl shadow-sm border border-gray-100 dark:border-none"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#5865F2]/10 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-[#060607] dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-[#4E5058] dark:text-[#DBDEE1] text-lg leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
