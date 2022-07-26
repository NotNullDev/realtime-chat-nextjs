import { Message } from "@prisma/client";
import { z }  from 'zod'


import { createRouter } from "./context";

export const exampleRouter = createRouter()
  .query("hello", {
    input: z
      .object({
        text: z.string().nullish(),
      })
      .nullish(),
    resolve({ input }) {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    },
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.message.findMany();
    },
  })
  .mutation("addMessage", {
    input: z.object({
      authorId: z.string(),
      content: z.string(),

    }),
    async resolve({ctx, input }) {

      const createdMessage: Message = await ctx.prisma.message.create({
        data: {
          authorId: input.authorId,
          content: input.content,
        }
      });

      console.log('emitting message...')

      await ctx.pusher.trigger("chat", "newMessage", {
        createdMessage
      });

      return createdMessage;
    }
  })
  .mutation("deleteAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.message.deleteMany({});
    }
  })
