import type {NextPage} from "next";
import {useSession} from "next-auth/react";
import {ChatComponent} from "../components/ChatComponent";
import router from "next/router";
import { Prisma } from "@prisma/client";
import { useRoomStore } from "../utils/stores";
import Center from "../components/Center";

const SingInComponent = () => {
    return <div className="p-3">You are not logged in!</div>;
};

const RoomPage: NextPage = () => {
    const {data: session, status} = useSession();

    const currentRoom = useRoomStore(state => state.currentRoom);

    if ( ! currentRoom ) {
        return <Center style="font-bold text-xl">
            Error: room is not defined
            </Center>
    }

    if (status === "loading" ) {
        return <div>Loading...</div>;
    }


    if (!session) {
        router.push("/login");
        return <div className="flex1 items-center justify-center">
            <div>Loading...</div>
        </div>
    }

    return (
        <main className="grid place-items-center flex-1">
            <div className="flex w-[60vw] min-w-[550px]  h-full m-0 px-16  ">
                {/*<div className="flex-[2]">*/}
                {/*    <EmbeddedExcalidraw/>*/}
                {/*</div>*/}
                <div className="flex-[1] p-4">
                    <ChatComponent room={currentRoom}/>
                </div>
            </div>
        </main>
    );
};

export default RoomPage;
