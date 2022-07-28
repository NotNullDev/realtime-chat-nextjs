import { Message } from "@prisma/client";
import { z }  from 'zod'
import { MessageWithAuthor } from "../../types/prisma";


import { createRouter } from "./trpcContext";

export const chatMessagesRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.message.findMany({
        include: {
          author: true
        }
      });
    },
  })

  .mutation("addMessage", {
    input: z.object({
      authorId: z.string(),
      content:  z.string(),
    }),
    async resolve({ctx, input }) {

      const createdMessage: Message = await ctx.prisma.message.create({
        data: {
          authorId: input.authorId,
          content: input.content,
        }
      });

      const messageWithAuthor: MessageWithAuthor = await ctx.prisma.message.findFirst({
        where: {
            id: createdMessage.id
        },
        include: {
          author: true
        }
      });

      await ctx.pusher.trigger("chat", "newMessage", {
        messageWithAuthor
      });

      return messageWithAuthor;
    }
  })

 .mutation("deleteAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.message.deleteMany({});
    }
  })