"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface Message {
  sender: "player" | "bot";
  content: string;
  timestamp: Date;
}

export default function BotJanken() {
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const hands = [
    { id: 0, name: "グー", emoji: "✊" },
    { id: 1, name: "チョキ", emoji: "✌️" },
    { id: 2, name: "パー", emoji: "✋" },
  ] as const;

  const playGame = (playerHandId: number) => {
    const botHandId = Math.floor(Math.random() * 3);
    const gameResult = (3 + playerHandId - botHandId) % 3;

    const resultText =
      gameResult === 0
        ? "あいこ・。・"
        : gameResult === 2
          ? "お前の勝ち・、・"
          : "お前の負けｖ＾。＾。＾ｖ";

    const playerMessage: Message = {
      sender: "player",
      content: `${hands[playerHandId].emoji} ${hands[playerHandId].name}を出しました！`,
      timestamp: new Date(),
    };

    const botMessage: Message = {
      sender: "bot",
      content: `${hands[botHandId].emoji} ${hands[botHandId].name}を出しました ${resultText}`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, playerMessage, botMessage]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-4 h-[600px] flex flex-col bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-800">
      <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-t-lg border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">時報とじゃんけん！</h1>
        <p>created by <a href="https://twitter.com/@wister_fujicco" className="text-blue-500">@wister_fujicco</a></p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={`${message.sender}-${message.timestamp.getTime()}`}
              className={`flex gap-3 ${
                message.sender === "player" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "bot" && (
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/images/clock-2.png" />
                </Avatar>
              )}
              <div
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.sender === "player"
                    ? "bg-blue-500 dark:bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-slate-800 rounded-b-lg">
        <div className="flex gap-2 justify-center">
          {hands.map((hand) => (
            <Button
              key={hand.id}
              onClick={() => playGame(hand.id)}
              variant={"outline"}
              className="text-lg"
            >
              {hand.emoji} {hand.name}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
