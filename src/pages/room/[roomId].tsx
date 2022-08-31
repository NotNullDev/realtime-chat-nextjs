import {useSession} from "next-auth/react";
import {ChatComponent} from "../../components/ChatComponent";
import {useRouter} from "next/router";
import {useEffect} from "react";
import {ChatRoom} from "../../types/prisma";

export const RoomPage = () => {
    const {data: session, status} = useSession();

    const router = useRouter();
    const { data: roomStr  } = router.query;

    let room: ChatRoom | undefined = undefined;

    useEffect(() => {
        if (!roomStr) {
            router.push("/");
        }

        if (!session) {
            router.push("/login");
        }
    }, []);

    if ( typeof roomStr === "string") {
         room = JSON.parse(roomStr);
    }

    if (status === "loading" || !session || !room) {
        return <div className="flex1 items-center justify-center">
            <div>Loading...</div>
        </div>
    }


    return (
        <main className="grid place-items-center flex-1">
            <div className="flex w-[60vw] min-w-[550px]  h-full m-0 px-16  ">
                <div className="flex-[1] p-4">
                    <ChatComponent room={room}/>
                </div>
            </div>
        </main>
    );

}

export default RoomPage;