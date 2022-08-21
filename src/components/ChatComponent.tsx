import {useEffect, useRef, useState} from "react";
import {MessageWithAuthor} from "../types/prisma";
import {trpc} from "../utils/trpc";
import {useSession} from "next-auth/react";
import {AppRouter} from "../server/router";
import SingleMessage from "./SingleMessage";
import {getCurrentPusherInstance, useRoomStore} from "../utils/stores";
import ErrorMessages from "../utils/errorMessages.json";
import {v4 as uuid} from "uuid";
import {TRPCClientError} from "@trpc/client";
import {usePathManager} from "../utils/hooks";
import Pusher from "pusher-js";

export type SyncedMessage = MessageWithAuthor & {
    isSynced: boolean;
    roomId: BigInt
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

export function ChatComponent() {
    const [validationErrorMessage, setValidationErrorMessage] = useState<string>("");

    const room = useRoomStore(state => state.currentRoom);
    const messages = useRoomStore(state => state.currentRoomMessages);
    const addMessage = useRoomStore(state => state.addRawMessage);
    const setCallback = useRoomStore(state => state.setNewMessageCallback);

    const pathManager = usePathManager();

    const {data: session} = useSession();

    const msgBox = useRef<HTMLDivElement>(null);
    const textArea = useRef<HTMLTextAreaElement>(null);

    let pusher: Pusher | null = null;

    useEffect(() => {
        document.addEventListener("keydown", (e) => {
            if (document.activeElement !== textArea.current && e.key === "/") {
                textArea.current?.focus();
                e.preventDefault();
            }

            const currentRoom = useRoomStore.getState().currentRoom;
            console.log(JSON.stringify(currentRoom));

            pusher = getCurrentPusherInstance();

            const channel = pusher.subscribe(currentRoom?.name ?? "");

            channel.bind("new-message", (msg) => {
               console.log("OMAG!: ", msg);
            });
        });



    }, []);

    const messageMutation = trpc.useMutation("chatMessagesRouter.addMessage");

    // HOOKS END

    if (!room) { // if error will occur try this: return redirecting, and check in useState if there is room, if not, then redirect
        console.error("Current room is not defined!");
        pathManager.pushToLogin();
        return <div>Redirecting...</div>
    }

    const messageTextChangeHandler = (e: any) => {
        if (e.key.toLowerCase() !== "enter") {

            if (validationErrorMessage !== "") {
                setValidationErrorMessage("");
            }

            return;
        }

        if (e.ctrlKey && e.key === "Enter") {

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
                roomId: room.id,
                room: room
            } as SyncedMessage;

            e.target.value = "";
            addMessage(message);

            try {
                messageMutation.mutateAsync({
                    ...message,
                    roomId: message.roomId.toString()
                }, {
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
                    console.error(e);
                })
            } catch (e) {
                console.error(e);
            }
        }
    };

    if (!session?.user) {
        return <div>You are not logged in.</div>;
    }

    const inputErrorStyle = validationErrorMessage !== "" ? `input-error` : ``;
    let inputErrorMessageStyle = validationErrorMessage === "" ? `hidden` : ``;

    const onNewMessage = (message: any) => {
        console.log("Received somthiung!! " + message);
    }

    setCallback(onNewMessage);

    return (
        <>
            <div className="h-full flex flex-col items-center">
                <div
                    className="h-[65vh] w-full card shadow-xl p-3 flex flex-col-reverse overflow-y-scroll"
                    id="messages"
                >
                    <div ref={msgBox}></div>
                    {/* TODO: change mechanism for auto scrolling - current contains bugs*/}
                    {messages?.length == 0 ? (
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
                    <div className="flex justify-center items-center mt-2 px-6">
                        <textarea
                            onKeyDown={(e) => messageTextChangeHandler(e)}
                            className={`w-full text-start textarea textarea-bordered ${inputErrorStyle}`}
                            placeholder="Ctrl + Enter to send message, '/' to focus"
                            ref={textArea}
                        />
                        <button type="submit" className="btn ml-3">Send</button>
                    </div>
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


// const deleteAllMsgMutation = trpc.useMutation("chatMessagesRouter.deleteAll");
//
// const clearMessages = (
//     trpcContextState: TRPCContextState<AppRouter, unknown>
// ) => {
//     deleteAllMsgMutation.mutateAsync(null, {
//         onSuccess: () => {
//             trpcContextState.invalidateQueries("chatMessagesRouter.getAll");
//             alert("OMG WHERE ARE ALL THE MESSAGES? 🤔");
//         },
//         onError: () => errorHandler(),
//     });
// };