import { Message } from "@prisma/client";
import { z } from "zod";
import { SyncedMessage } from "../../components/ChatComponent";
import { MessageWithAuthor } from "../../types/prisma";

import { createRouter } from "./trpcContext";

export const MAX_QUERY_LIMIT = 20;

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export const chatMessagesRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.message.findMany({
        include: {
          author: true,
        },
      });
    },
  })

  .mutation("addMessage", {
    input: z.object({
      authorId: z.string(),
      content: z.string(),
      id: z.bigint(),
      isSynced: z.boolean(),
      author: z.any(),
      createdAt: z.date(),
      clientUUID: z.string(),
    }),
    async resolve({ ctx, input }) {
      const createdMessage: Message = await ctx.prisma.message.create({
        data: {
          authorId: input.authorId,
          content: input.content,
          clientUUID: input.clientUUID,
        } as Message,
      });

      const messageWithAuthor: MessageWithAuthor =
        await ctx.prisma.message.findFirst({
          where: {
            id: createdMessage.id,
          },
          include: {
            author: true,
          },
        });

      await ctx.pusher.trigger("chat", "newMessage", messageWithAuthor);

      return messageWithAuthor;
    },
  })

  .mutation("deleteAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.message.deleteMany({});
    },
  })

  .query("infiniteMessages", {
    input: z.object({
      limit: z.number().min(1).max(MAX_QUERY_LIMIT),
      cursor: z.number().nullish(),
    }),
    async resolve({ ctx, input }) {
      const limit = input.limit ?? MAX_QUERY_LIMIT;

      let { cursor } = input;

      const messages = await prisma?.message.findMany({
        take: limit + 1,
        include: {
          author: true,
        },
        cursor: {
          id: BigInt(cursor?.toString() ?? 0) as any,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (!messages) {
        throw new Error("No messages found");
      }

      let nextCursor: number | undefined;

      nextCursor = cursor ?? 0 + messages.length + 1;

      return {
        messages,
        nextCursor: nextCursor,
      };
    },
  });
