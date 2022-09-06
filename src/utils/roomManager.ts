import {Message} from "@prisma/client";

const roomManager = () => {
    const joinRoom = (roomName: string) => {

    }

    const subscribeToRoom = (roomName: string, event: string, callback: (message: Message) => void) => {

    }

    const publishToChannel = (roomName: string, event: string, message: Message) => {

    }

    const createRoom = (roomName: string, isPrivate: boolean): string => {
        return "newChannelId";
    }

    const removeRoom = (channel: string) => {

    }

    return {
        joinRoom,
    }
}

export default roomManager;