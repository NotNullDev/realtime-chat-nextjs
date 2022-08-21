import {ChatRoom} from "../types/prisma";
import {useRouter} from "next/router";

export function useRoomManager() {
    const router = useRouter();

    async function push(room: ChatRoom) {
        await router.push(`/room/${room.id}`);
    }

    return {
        push
    }
}