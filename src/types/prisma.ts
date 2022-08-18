import { Prisma } from '@prisma/client'

export type MessageWithAuthor = Prisma.MessageGetPayload<{
    include: {
        author: true,
        room: true
    }
}>

export type ChatRoom = Prisma.RoomGetPayload<{
    include: {
        activeUsers: true,
        admins: true,
        owner: true,
        messages: {
            include: {
                author: true,
            }
        }
    }
}>;
