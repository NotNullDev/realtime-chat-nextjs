import {ChatRoom} from "../types/prisma";
import {useRouter} from "next/router";
import {useRoomStore} from "./stores";

export function usePathManager() {
    const router = useRouter();
    const setCurrentRoom = useRoomStore(state => state.setCurrentRoom);

    async function pushToRoom(room: ChatRoom) {
        const roomPageEndpoint = `/room/${room.id}`;

        setCurrentRoom(room);

        await router.push({
            pathname: roomPageEndpoint,
            query: {
                data: JSON.stringify(room),
            }
        }, roomPageEndpoint);
    }

    async function pushToLogin() {
        await router.push("/");
    }

    return {
        pushToRoom,
        pushToLogin
    }
}