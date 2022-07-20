import {Message} from "@prisma/client";
import type {NextPage} from "next";
import {
    createRef,
    useEffect,
} from "react";
import SingleMessage from "../components/singleMessage";
import {trpc} from "../utils/trpc";
import {signIn, useSession} from "next-auth/react";
import {TRPCContextState} from "@trpc/react/src/internals/context";
import {AppRouter} from "../server/router";
import AppHeader from "../components/AppHeader";

export type ChatMessage = {
    author: string;
    content: string;
    timestamp: Date;
};

function ChatComponent({trpcContext}: { trpcContext: any }) {

    const msgBox = createRef<HTMLDivElement>();

    useEffect(() => {
        scrollIntoView(msgBox);
    }, [msgBox]);

    const messagesQuery = trpc.useQuery(["example.getAll"]);
    const messageMutation = trpc.useMutation("example.addMessage");
    const deleteAllMsgMutation = trpc.useMutation("example.deleteAll");

    const clearMessages = (trpcContextState: TRPCContextState<AppRouter, unknown>) => {
        deleteAllMsgMutation.mutateAsync(null, {
            onSuccess: () => {
                alert("OMG WHERE ARE ALL THE MESSAGES? 🤔");
                trpcContextState.invalidateQueries("example.getAll");
            },
            onError: () => errorHandler(),
        });
    };

    const messages = messagesQuery.data;

    const {data: session} = useSession();

    const messageTextChangeHandler = (e: any) => {
        console.log(typeof e);

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
        return <div>Error reading messages from databases.</div>
    }

    return (
        <>
            <div
                className="w-[40vw] h-[40vh] border-black border-2 rounded p-3 flex flex-col overflow-y-scroll"
                id="messages"
            >
                {messages.map((message) => (
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
    return (
        <div className="p-3">You are not logged in!</div>
    )
}

const scrollIntoView = (element: any) => {
    element.current?.scrollIntoView({behavior: "smooth"});
};

function errorHandler() {
    alert("😯😯😯😯😯😯 Error! 😯😯😯😯😯😯");
}

const Home: NextPage = () => {
    const {data: session, status} = useSession();

    const trpcContextState = trpc.useContext();

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="grid place-items-center h-[100vh] bg-indigo-500">
                <div>
                    <AppHeader/>
                    <div className="grid place-items-center">
                        {
                            session ?
                                <ChatComponent trpcContext={trpcContextState}/> :
                                <SingInComponent/>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
