import {createRef, useEffect, useState} from "react";
import {MessageWithAuthor} from "../types/prisma";
import {trpc} from "../utils/trpc";
import {useSession} from "next-auth/react";
import Pusher from "pusher-js";
import {TRPCContextState} from "@trpc/react/src/internals/context";
import {AppRouter} from "../server/router";
import SingleMessage from "./SingleMessage";
import {useQueryClient} from "react-query";
import {useMessagesStore} from "../utils/stores";
import ErrorMessages from "../utils/errorMessages.json";
import {v4 as uuid} from "uuid";
import {TRPCClientError} from "@trpc/client";
import {ZodError} from "zod";

export type SyncedMessage = MessageWithAuthor & {
    isSynced: boolean;
};

type ChatMessageResponse = {
    messages: MessageWithAuthor[];
    cursor: string;
};

const fetchMessages = async ({queryKey}) => {
    const cursor = queryKey[1];

    if (typeof cursor !== "number") {
        console.error(cursor);
        throw new Error("OMG I NEED NUMBER NOT SOME #@!");
    }

    const uri = `/api/getMessages?cursor=${cursor}`;

    const resp = await fetch(uri);

    const messages = await resp.json();

    return messages as ChatMessageResponse;
};
let fetched = false;

export function ChatComponent() {
    const {addMessage, setMessages} = useMessagesStore((state) => state);
    const messages = useMessagesStore((state) => state.messages);
    const [validationErrorMessage, setValidationErrorMessage] = useState<string>("");

    const queryClient = useQueryClient();

    const {data: session} = useSession();

    const msgBox = createRef<HTMLDivElement>();

    useEffect(() => {
        scrollIntoView(msgBox);
    }, [msgBox]);

    useEffect(() => {
        if (messages.length === 0 && !fetched) {
            fetched = true;
            console.log("Fetching initial messages");
            queryClient
                .fetchQuery(["fetchMessages", 2], fetchMessages)
                .then((data) => {
                    const syncedMessages: SyncedMessage[] = data.messages.map((msg) => {
                        const syncedMessage = msg as SyncedMessage;
                        syncedMessage.isSynced = true;
                        return syncedMessage;
                    })
                    setMessages(syncedMessages);
                    console.log("Fetched initial messages!", data);
                })
                .catch((e) => console.log(e));
        }
        if (Pusher.instances.length >= 1) {
            return;
        }
        Pusher.logToConsole = false;

        const pusher = new Pusher("266ceafac0f9727d92b7", {
            cluster: "eu",
        });

        const channel = pusher.subscribe("chat");

        channel.bind("newMessage", async function (data) {
            console.log("Received message from the server: ", data);
            addMessage(data);
            scrollIntoView(msgBox);
        });
    });

    const messageMutation = trpc.useMutation("chatMessagesRouter.addMessage");
    const deleteAllMsgMutation = trpc.useMutation("chatMessagesRouter.deleteAll");

    const clearMessages = (
        trpcContextState: TRPCContextState<AppRouter, unknown>
    ) => {
        deleteAllMsgMutation.mutateAsync(null, {
            onSuccess: () => {
                trpcContextState.invalidateQueries("chatMessagesRouter.getAll");
                alert("OMG WHERE ARE ALL THE MESSAGES? 🤔");
            },
            onError: () => errorHandler(),
        });
    };

    const messageTextChangeHandler = (e: any) => {
        if (e.key.toLowerCase() !== "enter") {

            if (validationErrorMessage !== "") {
                setValidationErrorMessage("");
            }

            return;
        }

        if (e.target.value.trim() === "") {
            setValidationErrorMessage(ErrorMessages.CAN_NOT_BE_EMPTY)
            return;
        }

        const currentUserId = session?.user?.id;
        if (!currentUserId) {
            console.log("Current session object: ", session);
            throw new Error("Error: currentUserId is null");
        }

        const message = {
            id: BigInt("-1"),
            authorId: currentUserId,
            content: e.target.value,
            isSynced: false,
            author: session.user,
            createdAt: new Date(),
            clientUUID: uuid(),
        } as SyncedMessage;

        e.target.value = "";
        addMessage(message);


        try {
            messageMutation.mutateAsync(message, {
                onSuccess: () => {
                    console.log("Message sent!");
                },
                onError: (error) => {
                    let errorMessages = JSON.parse(error.message) as TRPCClientError<AppRouter>[];

                    let errorMessage = errorMessages.reduce((acc, error) => acc + error.message + ", ", "");

                    errorMessage = errorMessage.substring(0, errorMessage.length - 2);
                    setValidationErrorMessage(errorMessage);
                }
            }).catch(e => {

            })
        } catch (e) {

        }
    };

    if (!session?.user) {
        return <div>You are not logged in.</div>;
    }

    const inputErrorStyle = validationErrorMessage !== "" ? `input-error` : ``;
    let inputErrorMessageStyle = validationErrorMessage === "" ? `hidden` : ``;

    return (
        <>
            <div className="h-full flex flex-col items-center">
                <div
                    className="h-[80vh] w-full card shadow-xl p-3 flex flex-col-reverse overflow-y-scroll"
                    id="messages"
                >
                    <div ref={msgBox}></div>
                    {messages.length == 0 ? (
                        <div className="grid place-items-center w-full h-full">
                            <p className="">No messages to show</p>
                        </div>
                    ) : (
                        messages.map((message) => (
                            <SingleMessage
                                message={message}
                                currentUser={session?.user}
                                key={message.clientUUID}
                            />
                        ))
                    )}
                </div>
                <div className="w-full">
                    <input
                        onKeyDown={(e) => messageTextChangeHandler(e)}
                        className={`w-full text-center textarea textarea-bordered mt-2 ${inputErrorStyle}`}
                        type="text"
                        placeholder="Ctrl + Enter to send message"
                    />
                    <p className={`text-red-500 text-xs italic mt-1 ${inputErrorMessageStyle}`}>{validationErrorMessage}</p>
                </div>
            </div>
        </>
    );
}

const scrollIntoView = (element: any) => {
    element.current?.scrollIntoView({behavior: "smooth"});
};

function errorHandler() {
    alert("😯😯😯😯😯😯 Error! 😯😯😯😯😯😯");
}
