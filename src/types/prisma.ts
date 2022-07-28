import { Prisma } from '@prisma/client'

export type MessageWithAuthor = Prisma.MessageGetPayload<{
    include: {
        author: true
    }
}>
