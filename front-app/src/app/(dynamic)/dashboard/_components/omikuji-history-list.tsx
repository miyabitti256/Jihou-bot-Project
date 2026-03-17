"use client";

import { formatDistance } from "date-fns";
import { ja } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner"; // Assuming sonner or useToast is available
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateOmikujiAITextAction } from "@/lib/actions/omikuji";

type OmikujiResult = {
  id: string;
  result: string;
  createdAt: Date | string;
  withText?: boolean;
  aiText?: string | null;
};

interface Props {
  omikuji: OmikujiResult[];
}

export function OmikujiHistoryList({ omikuji: initialOmikuji }: Props) {
  const [omikujiList, setOmikujiList] =
    useState<OmikujiResult[]>(initialOmikuji);
  const [selectedItem, setSelectedItem] = useState<OmikujiResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateText = async (id: string) => {
    try {
      setIsGenerating(true);
      const res = await generateOmikujiAITextAction(id);

      if (!res.success || !res.aiText) {
        throw new Error(res.error || "Failed to generate text");
      }

      // Update local state
      setOmikujiList((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, withText: true, aiText: res.aiText }
            : item,
        ),
      );

      if (selectedItem?.id === id) {
        setSelectedItem((prev) =>
          prev ? { ...prev, withText: true, aiText: res.aiText } : null,
        );
      }

      toast.success("AI解説の生成が完了しました！");
    } catch {
      toast.error("解説の生成に失敗しました。");
    } finally {
      setIsGenerating(false);
    }
  };

  if (omikujiList.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-[#949BA4]">
        まだおみくじを引いたことがありません
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col">
        {omikujiList.map((result) => (
          <button
            key={result.id}
            type="button"
            onClick={() => setSelectedItem(result)}
            className="w-full flex items-center justify-between p-4 border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-[#313338] transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-base text-gray-900 dark:text-white">
                {result.result}
              </span>
              {result.withText && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
                  AI解説あり
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-[#949BA4]">
              {formatDistance(new Date(result.createdAt), new Date(), {
                addSuffix: true,
                locale: ja,
              })}
            </span>
          </button>
        ))}
      </div>

      <Dialog
        open={!!selectedItem}
        onOpenChange={(open) => !open && setSelectedItem(null)}
      >
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>おみくじ結果</DialogTitle>
            <DialogDescription>
              {selectedItem &&
                formatDistance(new Date(selectedItem.createdAt), new Date(), {
                  addSuffix: true,
                  locale: ja,
                })}{" "}
              の結果
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2">
                <div className="text-4xl font-black text-gray-900 dark:text-white">
                  {selectedItem.result}
                </div>
              </div>

              {selectedItem.withText && selectedItem.aiText ? (
                <div className="p-4 bg-gray-50 dark:bg-[#1E1F22] rounded-xl whitespace-pre-wrap text-sm border border-gray-100 dark:border-white/5">
                  {selectedItem.aiText}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                  <p className="text-sm text-gray-500 dark:text-[#949BA4] text-center">
                    まだAI解説が生成されていません。
                    <br />
                    運勢の詳細な解説を生成しますか？
                  </p>
                  <Button
                    onClick={() => handleGenerateText(selectedItem.id)}
                    disabled={isGenerating}
                    className="w-full sm:w-auto"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        生成中...
                      </>
                    ) : (
                      "AI解説を生成する"
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
