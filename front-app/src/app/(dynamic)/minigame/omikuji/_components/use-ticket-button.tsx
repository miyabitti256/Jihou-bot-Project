"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { consumeItemAction } from "@/lib/actions/shop";

interface UseOmikujiTicketButtonProps {
  ticketId: string;
}

export function UseOmikujiTicketButton({
  ticketId,
}: UseOmikujiTicketButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleUseTicket = () => {
    startTransition(async () => {
      const res = await consumeItemAction(ticketId);
      if (res.success) {
        toast.success(
          "おみくじ券を使用しました！もう一度おみくじを引くことができます。",
        );
        router.refresh();
      } else {
        toast.error(res.error || "おみくじ券の使用に失敗しました。");
      }
    });
  };

  return (
    <Button
      onClick={handleUseTicket}
      disabled={isPending}
      className="mt-4 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold"
    >
      おみくじ券を使用してもう一度引く
    </Button>
  );
}
