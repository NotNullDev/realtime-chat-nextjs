import {Message} from "@prisma/client";
import {z, ZodError} from "zod";
import {ChatRoom, MessageWithAuthor} from "../../types/prisma";

import {createRouter} from "./trpcContext";
import {CAN_NOT_BE_EMPTY, CAN_NOT_BE_LONGER_THAN_500,} from "../../utils/errorMessage";

export const MAX_QUERY_LIMIT = 20;

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

export const chatMessagesRouter = createRouter()
  .formatError(({ shape, error }) => {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  })
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.message.findMany({
        include: {
          author: true,
          room: true,
        },
      });
    },
  })

  .mutation("addMessage", {
    input: z.object({
      authorId: z.string(),
      content: z
        .string()
        .trim()
        .min(1, CAN_NOT_BE_EMPTY)
        .max(500, CAN_NOT_BE_LONGER_THAN_500),
      id: z.bigint(),
      isSynced: z.boolean(),
      author: z.any(),
      createdAt: z.date(),
      clientUUID: z.string(),
      roomId: z.bigint(),
    }),
    async resolve({ ctx, input }) {
      const createdMessage: Message = await ctx.prisma.message.create({
        data: {
          authorId: input.authorId,
          content: input.content,
          clientUUID: input.clientUUID,
          roomId: input.roomId,
        } as Message,
      });

      const messageWithAuthor: MessageWithAuthor =
        await ctx.prisma.message.findFirst({
          where: {
            id: createdMessage.id,
          },
          include: {
            author: true,
            room: true,
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
    async resolve({ input }) {
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
  })

  .query("getRandomRoom", {
    async resolve({ ctx }) {
      const roomCount = await ctx.prisma.room.count();

      const randomRoomIndex = Math.floor(Math.random() * roomCount);

      const randomRoom = await prisma?.room.findFirst({
        skip: randomRoomIndex,
        include: {
          activeUsers: true,
          owner: true,
          admins: true,
          messages: true,
        },
      });

      return randomRoom as ChatRoom;
    },
  })

  .mutation("createRoom", {
    input: z.object({
      roomName: z.string().trim().min(1, CAN_NOT_BE_EMPTY),
      ownerId: z.string(),
      isPrivate: z.boolean()
    }),
    async resolve({ input }) {
      let room: ChatRoom | undefined = undefined;

      let aaa = await prisma?.room.create({
        data: {
          name: input.roomName,
          ownerId: input.ownerId,
          isPrivate: input.isPrivate,
        },
        select: {
          id: true,
          owner: true,
    }},);

      if (!aaa?.id) {
        return undefined;
      }

      room = {
        id: BigInt(aaa.id),
        name: input.roomName,
        ownerId: aaa.owner.id,
        owner: {...aaa.owner} ,
        isPrivate: input.isPrivate,
        activeUsers: [],
        admins: [],
        messages: [],
      }

      return room;
    },
  })
    .query("getAllRooms", { // TODO: replace with infinite query
        async resolve({ ctx }) {

        const allRooms = await prisma?.room.findMany({
            include: {
                activeUsers: true,
                owner: true,
                admins: true,
                messages: true
            }});

        return allRooms;
        }
    })
    .mutation("verifyPrivateRoom", {
      input: z.object({
          roomName: z.string().trim().min(1, CAN_NOT_BE_EMPTY),
          privateKey: z.string().trim().min(1, CAN_NOT_BE_EMPTY),
      }),
        async resolve({ ctx, input }) {

          const requestedRoom = await prisma?.room.findFirst({
            select: {
              name: true,
              privateKey: true, // TODO: add index on privateKey?, rename to privateKeys
            },
            where: {
              name: input.roomName,
            }
          });

          if (requestedRoom) {
            if (requestedRoom.privateKey.find(key => key.key === input.privateKey)) {
                return true;
            }
          }

          return  false;
        }
    });
