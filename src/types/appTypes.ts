import {ChatRoom, MessageWithAuthor} from "./prisma";

export type RandomRoomResponse = {
    error: string | undefined
    room: ChatRoom | undefined
}

export type ChatMessageResponse = {
    message: MessageWithAuthor | undefined;
    error: string | undefined
};