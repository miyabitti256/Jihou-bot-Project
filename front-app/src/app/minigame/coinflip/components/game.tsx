"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { flipCoin } from "./actions";

const AMOUNT_STEPS = [100, 500, 1000, 5000];

const BetAdjustButton = ({
  amount,
  isIncrement,
  onClick,
}: {
  amount: number;
  isIncrement: boolean;
  onClick: () => void;
}) => (
  <Button variant="outline" size="sm" onClick={onClick}>
    {isIncrement ? "+" : "-"}
    {amount}
  </Button>
);

export default function CoinflipGame() {
  const [bet, setBet] = useState(100);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<null | {
    win: boolean;
    coinResult: string;
    updatedMoney: number;
    moneyChange: number;
  }>(null);

  const handlePlay = async (choice: "heads" | "tails") => {
    setResult(null);

    try {
      const data = await flipCoin(bet, choice);
      if (data.data) {
        setIsFlipping(true);
        setTimeout(() => {
          setResult(data.data);
          setIsFlipping(false);
        }, 1000);
      } else {
        toast.error(data.error.message);
        setIsFlipping(false);
      }
    } catch (error) {
      console.error(error);
      setIsFlipping(false);
    }
  };

  return (
    <div className="min-h-[820px] p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          コイントスゲーム
        </h1>

        <div className="relative h-48 w-48 mx-auto mb-8">
          <AnimatePresence>
            {isFlipping && (
              <motion.div
                className="w-full h-full rounded-full bg-yellow-400"
                animate={{
                  rotateX: [0, 720],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  ease: "easeInOut",
                }}
              />
            )}
          </AnimatePresence>
        </div>

        <div className="mb-4 space-y-4">
          <div className="flex items-center gap-4">
            <label htmlFor="bet" className="block text-sm font-medium">
              賭け金額:
            </label>
            <Input
              type="number"
              id="bet"
              min="1"
              max="10000"
              step="1"
              value={bet}
              onChange={(e) => {
                const value = Number(e.target.value);
                if (value >= 1 && value <= 10000) {
                  setBet(value);
                }
              }}
              className="w-24 px-2 py-1"
            />
            <span className="text-sm">円</span>
          </div>

          <input
            type="range"
            min="1"
            max="10000"
            step="1"
            value={bet}
            onChange={(e) => setBet(Number(e.target.value))}
            className="w-full"
          />

          <div className="flex justify-between text-xs text-gray-400">
            <span>1円</span>
            <span>10,000円</span>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {AMOUNT_STEPS.map((amount) => (
              <BetAdjustButton
                key={`inc-${amount}`}
                amount={amount}
                isIncrement={true}
                onClick={() => setBet((prev) => Math.min(10000, prev + amount))}
              />
            ))}
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            {AMOUNT_STEPS.map((amount) => (
              <BetAdjustButton
                key={`dec-${amount}`}
                amount={amount}
                isIncrement={false}
                onClick={() => setBet((prev) => Math.max(1, prev - amount))}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-500 text-white dark:bg-blue-600 rounded-lg"
            onClick={() => handlePlay("heads")}
            disabled={isFlipping}
          >
            表
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-red-500 text-white dark:bg-red-600 rounded-lg"
            onClick={() => handlePlay("tails")}
            disabled={isFlipping}
          >
            裏
          </motion.button>
        </div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`p-4 rounded-lg text-center ${
                result.win ? "bg-green-500" : "bg-red-500"
              }`}
            >
              <h2 className="text-2xl font-bold mb-2">
                {result.win ? "勝ち！" : "負け..."}
              </h2>
              <p>結果: {result.coinResult === "heads" ? "表" : "裏"}</p>
              <p>
                {result.win ? "+" : ""}
                {result.moneyChange}円
              </p>
              <p>所持金: {result.updatedMoney}円</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
