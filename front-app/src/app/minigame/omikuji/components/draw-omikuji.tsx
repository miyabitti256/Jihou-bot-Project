"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { drawOmikuji } from "./actions";
import { useRouter } from "next/navigation";
import type { ApiResponse } from "@/types/api-response";

interface Props {
  userId: string;
}

interface OmikujiResponse extends ApiResponse {
  data: {
    id: string;
    userId: string;
    result: string;
    createdAt: Date;
  };
}

export default function DrawOmikuji({ userId }: Props) {
  const router = useRouter();
  const [omikuji, setOmikuji] = useState<OmikujiResponse | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getOmikuji = async () => {
    setIsDrawing(true);

    const data: OmikujiResponse = await drawOmikuji(userId);

    setTimeout(() => {
      if (data.status === "success") {
        setOmikuji(data);
      } else {
        toast.error(data.error?.message);
      }
      setIsDrawing(false);
    }, 3000);

    setTimeout(() => {
      router.refresh();
    }, 10000);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <div className="relative flex flex-col items-center">
        {!isDrawing && !omikuji && (
          <div className="w-64 h-64 relative mb-4">
            <Image
              src="/images/omikuji-box.png"
              alt="おみくじ箱"
              fill
              priority
              className="object-contain"
            />
          </div>
        )}

        <AnimatePresence>
          {isDrawing ? (
            <motion.div
              initial={{ y: 0 }}
              animate={{
                y: [-30, 0],
              }}
              transition={{
                y: {
                  duration: 0.4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                },
              }}
              className="w-64 h-64"
            >
              <Image
                src="/images/omikuji-box.png"
                alt="おみくじ箱"
                fill
                className="object-contain"
              />
            </motion.div>
          ) : (
            omikuji && (
              <div className="w-32 h-[287px]">
                <motion.div
                  initial={{ opacity: 0, rotate: 0 }}
                  animate={{ opacity: 1, rotate: 360 }}
                  transition={{
                    opacity: { duration: 0.5 },
                    rotate: {
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    },
                  }}
                  className="w-full h-full rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, transparent 40%, transparent 40%), repeating-conic-gradient(from 0deg, transparent 0deg 20deg, rgba(255, 215, 0, 0.2) 20deg 40deg)",
                    zIndex: -1,
                    aspectRatio: "1 / 1",
                    width: "256px",
                    height: "256px",
                    margin: "auto",
                    position: "absolute",
                    top: "0",
                    left: "-50%",
                  }}
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{
                    width: "128px",
                    height: "287px",
                  }}
                >
                  <Image
                    src={`/images/omikuji-${omikuji.data.result}.png`}
                    alt={`おみくじ結果: ${omikuji.data.result}`}
                    width={128}
                    height={287}
                    className="object-contain"
                  />
                </motion.div>
              </div>
            )
          )}
        </AnimatePresence>

        {!isDrawing && !omikuji && (
          <Button onClick={getOmikuji} disabled={isDrawing} className="mb-4">
            おみくじを引く
          </Button>
        )}
      </div>
    </div>
  );
}
