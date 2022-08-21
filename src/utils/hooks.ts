import {ChatRoom} from "../types/prisma";
import {useRouter} from "next/router";

export function usePathManager() {
    const router = useRouter();

    async function pushToRoom(room: ChatRoom) {

        const roomPageEndpoint = `/room/${room.id}`;

        await router.push({
            pathname: roomPageEndpoint
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