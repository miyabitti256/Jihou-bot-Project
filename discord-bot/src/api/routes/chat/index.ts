import { Hono } from "hono";
import {
  generateTextStream,
  generateChatText,
  generateChatTextStream,
  SYSTEM_PROMPT,
} from "@lib/gemini-client";
import { logger } from "@lib/logger";
import { prisma } from "@lib/prisma";
import { estimateTokenCount } from "@lib/utils";
import { ChatRole } from "@prisma/client";

// メッセージの型定義
interface ChatMessageData {
  role: ChatRole;
  content: string;
  tokenCount: number;
  createdAt: Date;
}

export const chat = new Hono();

// チャットスレッド作成エンドポイント
chat.post("/threads", async (c) => {
  try {
    const body = await c.req.json();
    const { channelId, guildId, creatorId, title = "新しい会話" } = body;

    if (!channelId || !creatorId) {
      return c.json(
        {
          status: "error",
          error: {
            code: "MISSING_REQUIRED_FIELDS",
            message: "必須フィールドが不足しています",
          },
        },
        400,
      );
    }

    // DMチャンネルの場合はguildIdが空の場合があるので特殊値を設定
    const finalGuildId = guildId || "DM_CHANNEL";

    logger.info(
      `[chat] Creating thread in database: channelId=${channelId}, guildId=${finalGuildId}, creatorId=${creatorId}`,
    );

    const thread = await prisma.chatThread.create({
      data: {
        id: channelId,
        guildId: finalGuildId,
        channelId,
        creatorId,
        title,
      },
    });

    return c.json({
      status: "success",
      data: {
        thread,
      },
    });
  } catch (error) {
    logger.error(`[chat] Error creating thread: ${error}`);
    return c.json(
      {
        status: "error",
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "スレッド作成中にエラーが発生しました",
          details: error,
        },
      },
      500,
    );
  }
});

// チャットスレッド取得エンドポイント
chat.get("/threads/:threadId", async (c) => {
  try {
    const threadId = c.req.param("threadId");

    const thread = await prisma.chatThread.findUnique({
      where: {
        id: threadId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!thread) {
      return c.json(
        {
          status: "error",
          error: {
            code: "THREAD_NOT_FOUND",
            message: "指定されたスレッドが見つかりません",
          },
        },
        404,
      );
    }

    return c.json({
      status: "success",
      data: {
        thread,
      },
    });
  } catch (error) {
    logger.error(`[chat] Error fetching thread: ${error}`);
    return c.json(
      {
        status: "error",
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "スレッド取得中にエラーが発生しました",
          details: error,
        },
      },
      500,
    );
  }
});

// チャットスレッドアーカイブエンドポイント
chat.post("/threads/:threadId/archive", async (c) => {
  try {
    const threadId = c.req.param("threadId");

    const thread = await prisma.chatThread.findUnique({
      where: {
        id: threadId,
      },
    });

    if (!thread) {
      return c.json(
        {
          status: "error",
          error: {
            code: "THREAD_NOT_FOUND",
            message: "指定されたスレッドが見つかりません",
          },
        },
        404,
      );
    }

    if (!thread.isActive) {
      return c.json(
        {
          status: "error",
          error: {
            code: "THREAD_ARCHIVED",
            message: "このスレッドは既にアーカイブされています",
          },
        },
        400,
      );
    }

    await prisma.chatThread.update({
      where: {
        id: threadId,
      },
      data: {
        isActive: false,
      },
    });

    return c.json({
      status: "success",
      data: {
        message: "スレッドをアーカイブしました",
      },
    });
  } catch (error) {
    logger.error(`[chat] Error archiving thread: ${error}`);
    return c.json(
      {
        status: "error",
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "スレッドのアーカイブ中にエラーが発生しました",
          details: error,
        },
      },
      500,
    );
  }
});

// テキスト生成エンドポイント
chat.post("/generate", async (c) => {
  try {
    const body = await c.req.json();
    const { contents, stream = false, threadId = null } = body;

    if (!contents) {
      return c.json(
        {
          status: "error",
          error: {
            code: "MISSING_CONTENTS",
            message: "コンテンツが指定されていません",
          },
        },
        400,
      );
    }

    // スレッドIDが指定されていれば会話履歴を使用する
    if (threadId) {
      try {
        const thread = await prisma.chatThread.findUnique({
          where: {
            id: threadId,
          },
          include: {
            messages: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        });

        if (!thread) {
          return c.json(
            {
              status: "error",
              error: {
                code: "THREAD_NOT_FOUND",
                message: "指定されたスレッドが見つかりません",
              },
            },
            404,
          );
        }

        if (!thread.isActive) {
          return c.json(
            {
              status: "error",
              error: {
                code: "THREAD_ARCHIVED",
                message: "このスレッドはアーカイブされています",
              },
            },
            400,
          );
        }

        // ユーザーメッセージをDBに保存
        const userMessageTokenCount = estimateTokenCount(contents);
        const userMessage = await prisma.chatMessage.create({
          data: {
            threadId,
            content: contents,
            role: ChatRole.USER,
            tokenCount: userMessageTokenCount,
          },
        });

        if (stream) {
          // ストリーミングレスポンス用のヘッダー設定
          c.header("Content-Type", "text/event-stream");
          c.header("Cache-Control", "no-cache");
          c.header("Connection", "keep-alive");

          // 履歴メッセージの処理
          let messages: Array<{ role: ChatRole; content: string }> = [];

          if (thread.messages.length === 0) {
            messages = [
              {
                role: ChatRole.USER,
                content: contents,
              },
            ];
          } else {
            messages = thread.messages.map((msg: ChatMessageData) => ({
              role: msg.role,
              content: msg.content,
            }));

            // 最新のユーザーメッセージを追加
            messages.push({
              role: ChatRole.USER,
              content: contents,
            });
          }

          const streamObj = await generateChatTextStream(messages);

          // Hono v4でのストリーミング処理
          return new Response(
            new ReadableStream({
              async start(controller) {
                let aiResponseText = "";

                try {
                  for await (const chunk of streamObj) {
                    if (chunk.text) {
                      const chunkText = chunk.text;
                      aiResponseText += chunkText;

                      controller.enqueue(
                        new TextEncoder().encode(
                          `data: ${JSON.stringify({ text: chunkText })}\n\n`,
                        ),
                      );
                    }
                  }

                  // AIの応答をDBに保存
                  const aiMessageTokenCount =
                    estimateTokenCount(aiResponseText);
                  await prisma.chatMessage.create({
                    data: {
                      threadId,
                      content: aiResponseText,
                      role: ChatRole.ASSISTANT,
                      tokenCount: aiMessageTokenCount,
                    },
                  });

                  controller.enqueue(
                    new TextEncoder().encode("data: [DONE]\n\n"),
                  );
                  controller.close();
                } catch (error) {
                  logger.error(`[chat] Stream error: ${error}`);
                  controller.enqueue(
                    new TextEncoder().encode(
                      `data: ${JSON.stringify({ error: "ストリーミング処理中にエラーが発生しました" })}\n\n`,
                    ),
                  );
                  controller.close();
                }
              },
            }),
            {
              headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
              },
            },
          );
        }

        // 履歴を使った通常のレスポンス
        let messages: Array<{ role: ChatRole; content: string }> = [];

        if (thread.messages.length === 0) {
          messages = [
            {
              role: ChatRole.USER,
              content: contents,
            },
          ];
        } else {
          messages = thread.messages.map((msg: ChatMessageData) => ({
            role: msg.role,
            content: msg.content,
          }));

          // 最新のユーザーメッセージを追加
          messages.push({
            role: ChatRole.USER,
            content: contents,
          });
        }

        const aiResponse = (await generateChatText(messages)) || "";

        // AIの応答をDBに保存
        const aiMessageTokenCount = estimateTokenCount(aiResponse);
        await prisma.chatMessage.create({
          data: {
            threadId,
            content: aiResponse,
            role: ChatRole.ASSISTANT,
            tokenCount: aiMessageTokenCount,
          },
        });

        return c.json({
          status: "success",
          data: {
            text: aiResponse,
          },
        });
      } catch (error) {
        logger.error(`[chat] Error generating text: ${error}`);
        return c.json(
          {
            status: "error",
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "テキスト生成中にエラーが発生しました",
              details: error,
            },
          },
          500,
        );
      }
    }

    // スレッドなしの場合は単発生成（既存の処理）
    if (stream) {
      c.header("Content-Type", "text/event-stream");
      c.header("Cache-Control", "no-cache");
      c.header("Connection", "keep-alive");

      const streamObj = await generateTextStream(
        `${SYSTEM_PROMPT}\n\nユーザー: ${contents}`,
      );

      return new Response(
        new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of streamObj) {
                if (chunk.text) {
                  try {
                    const jsonData = JSON.stringify({ text: chunk.text });
                    controller.enqueue(
                      new TextEncoder().encode(`data: ${jsonData}\n\n`),
                    );
                  } catch (jsonError) {
                    logger.error(
                      `[chat] JSON serialization error: ${jsonError}`,
                    );
                    // biome-ignore lint/correctness/noUnnecessaryContinue: <explanation>
                    continue;
                  }
                }
              }
              controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
              controller.close();
            } catch (error) {
              logger.error(`[chat] Stream error: ${error}`);
              try {
                const errorMessage = JSON.stringify({
                  error: "ストリーミング処理中にエラーが発生しました",
                });
                controller.enqueue(
                  new TextEncoder().encode(`data: ${errorMessage}\n\n`),
                );
              } catch (jsonError) {
                controller.enqueue(
                  new TextEncoder().encode(
                    `data: ${JSON.stringify({ error: "エラーが発生しました" })}\n\n`,
                  ),
                );
              }
              controller.close();
            }
          },
        }),
        {
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          },
        },
      );
    }

    const aiResponse =
      (await generateChatText([
        {
          role: ChatRole.USER,
          content: contents,
        },
      ])) || "";

    return c.json({
      status: "success",
      data: {
        text: aiResponse,
      },
    });
  } catch (error) {
    logger.error(`[chat] Error in generate endpoint: ${error}`);
    return c.json(
      {
        status: "error",
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "エラーが発生しました",
          details: error,
        },
      },
      500,
    );
  }
});
