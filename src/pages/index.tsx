import {Message} from "@prisma/client";
import type {NextPage} from "next";
import {createRef, useEffect, useMemo, useState} from "react";
import SingleMessage from "../components/singleMessage";
import {trpc} from "../utils/trpc";
import {TRPCContextState} from "@trpc/react/src/internals/context";
import {AppRouter} from "../server/router";
import AppHeader from "../components/AppHeader";
import {useSession} from "next-auth/react";
import {io} from 'socket.io-client';
import {numberOfRenders} from "./_app";

function ChatComponent({trpcContext}: { trpcContext: any }) {

    const [messages, setMessages] = useState<Message[]>([]);

    const {data: session} = useSession();

    const msgBox = createRef<HTMLDivElement>();

    const socketIoClient = useMemo(() => {

        console.log('connecting to ws');

        return io('ws://localhost:3001',{
            port: 3000
        })
    }, []);

    socketIoClient.on('newMessage', (message: Message) => {
        console.log('new message! :)', message);
        setMessages(old => [...old, message]);
    });


    const getAllQuery = trpc.useQuery(['example.getAll']);


    useEffect(() => {
        scrollIntoView(msgBox);
        setMessages(
            getAllQuery.data
        )
    }, [getAllQuery.data, msgBox]);

    const messageMutation = trpc.useMutation("example.addMessage");
    const deleteAllMsgMutation = trpc.useMutation("example.deleteAll");

    const clearMessages = (
        trpcContextState: TRPCContextState<AppRouter, unknown>
    ) => {
        deleteAllMsgMutation.mutateAsync(null, {
            onSuccess: () => {
                alert("OMG WHERE ARE ALL THE MESSAGES? 🤔");
                trpcContextState.invalidateQueries("example.getAll");
            },
            onError: () => errorHandler(),
        });
    };


    const messageTextChangeHandler = (e: any) => {

        if (e.key.toLowerCase() !== "enter") {
            return;
        }

        const message = {
            author: session?.user?.name ?? "Anonymous",
            content: e.target.value,
        };

        messageMutation.mutateAsync(
            message,
            {
                onSuccess: () => {
                    trpcContext.invalidateQueries("example.getAll");
                    e.target.value = "";
                    msgBox.current?.scrollIntoView({behavior: "smooth"});
                },
                onError: () => errorHandler(),
            }
        );

    };

    if (messages === undefined) {
        return <div>Error reading messages from databases.</div>;
    }

    return (
        <>
            <div
                className="w-[40vw] h-[40vh] border-black border-2 rounded p-3 flex flex-col overflow-y-scroll"
                id="messages"
            >
                {messages.map((message: any) => (
                    <SingleMessage
                        message={message}
                        key={message.id.valueOf() as unknown as number}
                    />
                ))}
                <div ref={msgBox}></div>
            </div>
            <input
                onKeyDown={(e) => messageTextChangeHandler(e)}
                className="mt-2 w-full rounded focus:border-none p-1"
                type="text"
                placeholder="Hello!"
            />
            <button onClick={() => clearMessages(trpcContext)}>Clear</button>
            <button onClick={() => scrollIntoView(msgBox)}>Scroll test</button>
            <button onClick={() => socketIoClient.emit('kickAll')}>Kick all</button>
        </>
    );
}

const SingInComponent = () => {
    return <div className="p-3">You are not logged in!</div>;
};

const scrollIntoView = (element: any) => {
    element.current?.scrollIntoView({behavior: "smooth"});
};

function errorHandler() {
    alert("😯😯😯😯😯😯 Error! 😯😯😯😯😯😯");
}

const Home: NextPage = () => {
    const {data: session, status} = useSession();

    const trpcContextState = trpc.useContext();

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="grid place-items-center h-[100vh] bg-indigo-500">
                <div>
                    <AppHeader/>
                    <div>Number of renders _app: {numberOfRenders}</div>
                    <div className="grid place-items-center">
                        {session ? (
                            <ChatComponent trpcContext={trpcContextState}/>
                        ) : (
                            <SingInComponent/>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
