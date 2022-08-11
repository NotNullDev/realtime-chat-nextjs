import type {NextPage} from "next";
import {useSession} from "next-auth/react";
import {ChatComponent} from "../components/ChatComponent";
import EmbeddedExcalidraw from "../components/EmbeddedExcalidraw";
import {router} from "next/client";
import {useEffect} from "react";

// let socketIOClient = io(`ws://localhost:3001`);

const SingInComponent = () => {
    return <div className="p-3">You are not logged in!</div>;
};

const Home: NextPage = () => {
    const {data: session, status} = useSession();

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    if (!session) {
        router.push("/api/auth/signin/google");
        return <div>Redirecting...</div>;
        // return <SingInComponent/>;
    }

    return (
        <main className="grid place-items-center flex-1">
            <div className="flex w-[60vw] min-w-[550px]  h-full m-0 px-16  ">
                {/*<div className="flex-[2]">*/}
                {/*    <EmbeddedExcalidraw/>*/}
                {/*</div>*/}
                <div className="flex-[1] p-4">
                    <ChatComponent/>
                </div>
            </div>
        </main>
    );
};


export default Home;
