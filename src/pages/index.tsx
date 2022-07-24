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

function createSocketIoClient(url: string) {
    return io();
}

function ChatComponent({trpcContext}: { trpcContext: any }) {

    const [messages, setMessages] = useState<Message[]>([]);

    //const messages = messagesQuery.data;
    const {data: session} = useSession();

    const msgBox = createRef<HTMLDivElement>();


    const socketIoClient = useMemo(() => createSocketIoClient(process.env.WS_URI ?? ""), []);

    socketIoClient.on('connect', () => {
        console.log('connected to socketIO');
    });

    socketIoClient.on('publishMessage', (message: Message) => {
        console.log('newMessage', message);
    });


    // const ourWs = useMemo(() => new WebSocket(`ws://localhost:3333`), []);

    // const wSockNoServ = useMemo(() => new WebSocketServer({
    //     noServer: true,
    //     port: 3333
    // }),[]);

    // wSockNoServ.on('connection', (ws) => {
    //     console.log('ws connected');
    // });


    // ourWs.addEventListener('open', () => {
    //     ourWs.send('hello');
    // });
    //
    // ourWs?.addEventListener('message', (event: any) => {
    //     console.log('received message: ', event)
    //     setMessages((currentMessages) => [...currentMessages, JSON.parse(event.data)]);
    // });

    //
    // trpc.useSubscription(['wsClientnewMessage'], {
    //     onNext: (message: any) => {
    //         console.log(message)
    //         // setMessages([...messages, message]);
    //         scrollIntoView(msgBox);
    //     },
    //     onError: (error: any) => {
    //         console.error(error);
    //         errorHandler();
    //         trpc.useContext().queryClient.invalidateQueries();
    //     }
    // });

    useEffect(() => {
        scrollIntoView(msgBox);
    }, [msgBox]);

    //const messagesQuery = trpc.useQuery(["example.getAll"]);
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

        messageMutation.mutateAsync(
            {
                author: session?.user?.name ?? "Anonymous",
                content: e.target.value,
            },
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
