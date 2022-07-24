import { createRouter } from "./context";
import { z }  from 'zod'

import { Message } from "@prisma/client";
import { appWs } from "../../pages/_app";
import {socketIOClient} from "../socketIOClient";

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
      content: z.string(),
      author: z.string()
    }),
    async resolve({ctx, input }) {

      const message = input as Message;

      if (!message) {
        return null;
      }

      const createdMessage: Message = await ctx.prisma.message.create({
        data: {
          author: message.author,
          content: message.content,
        }
      });

      console.log('emmiting message...')
      socketIOClient.emit('addMessage', createdMessage);

      return createdMessage;
    }
  })
  .mutation("deleteAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.message.deleteMany({});
    }
  })
