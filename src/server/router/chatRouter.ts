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
    .formatError(({shape, error}) => {
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
        async resolve({ctx}) {
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
            roomId: z.string(),
        }),
        async resolve({ctx, input}) {
            let messageWithAuthor: undefined | MessageWithAuthor = undefined;

            try {
                // 1. Create message in db
                const createdMessage = await prisma?.message.create({
                    data: {
                        authorId: input.authorId,
                        content: input.content,
                        clientUUID: input.clientUUID,
                        roomId: BigInt(input.roomId),
                    } as Message,
                    include: {
                        author: true,
                        room: true,
                    }
                });

                // Get additional data from database (TODO: optimize)
                if (!createdMessage) {
                    return;
                }

                messageWithAuthor = {
                    ...createdMessage,
                    id: BigInt(createdMessage?.id ?? "-1")
                }
            } catch (err) {
                console.error(err);
            }

            // Send new message to the other users

            if (!messageWithAuthor) {
                throw new Error("Something went wrong while creating message...");
            }

            let createdMessageChannel = messageWithAuthor.room.name ?? "";

            if (messageWithAuthor.room.isPrivate) {
                createdMessageChannel = "private-" + createdMessageChannel;
            }

            await ctx.pusher.trigger(createdMessageChannel, "new-message", messageWithAuthor);

            console.log("Message " + JSON.stringify(messageWithAuthor) + " has been published to channel: " + createdMessageChannel);

            return messageWithAuthor;
        },
    })

    .mutation("deleteAll", {
        async resolve({ctx}) {
            return await ctx.prisma.message.deleteMany({});
        },
    })

    .query("infiniteMessages", {
        input: z.object({
            limit: z.number().min(1).max(MAX_QUERY_LIMIT),
            cursor: z.number().nullish(),
        }),
        async resolve({input}) {
            const limit = input.limit ?? MAX_QUERY_LIMIT;

            let {cursor} = input;

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
        async resolve({ctx}) {
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
        async resolve({input}) {
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
                },
            },);

            if (!aaa?.id || !aaa?.owner) {
                throw new Error("Something went wrong while creating room...");
            }

            room = {
                id: BigInt(aaa.id),
                name: input.roomName,
                ownerId: aaa.owner.id,
                owner: {...aaa.owner},
                isPrivate: input.isPrivate,
                activeUsers: [],
                admins: [],
                messages: [],
            }

            return room;
        },
    })
    .query("getAllRooms", { // TODO: replace with infinite query
        async resolve({ctx}) {

            const allRooms = await prisma?.room.findMany({
                include: {
                    activeUsers: true,
                    owner: true,
                    admins: true,
                    messages: {
                        include: {
                            author: true
                        }
                    }
                },
                where: {
                    isPrivate: false
                }
            });

            return allRooms;
        }
    })
    .mutation("verifyPrivateRoom", {
        input: z.object({
            roomName: z.string().trim().min(1, CAN_NOT_BE_EMPTY),
            privateKey: z.string().trim().min(1, CAN_NOT_BE_EMPTY),
        }),
        async resolve({ctx, input}) {

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

            return false;
        }
    });
