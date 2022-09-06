import {useEffect, useRef, useState} from "react";
import {ChatRoom, MessageWithAuthor} from "../types/prisma";
import {useSession} from "next-auth/react";
import SingleMessage from "./SingleMessage";
import {getCurrentPusherInstance, useRoomStateStore} from "../utils/stores";
import ErrorMessages from "../utils/errorMessages.json";
import {v4 as uuid} from "uuid";
import {usePathManager} from "../utils/hooks";
import {useRouter} from "next/router";
import {useMutation} from "@tanstack/react-query";
import {Message} from "@prisma/client";
import {ChatMessageResponse} from "../types/appTypes";

export type SyncedMessage = MessageWithAuthor & {
    isSynced: boolean;
    roomId: BigInt;
};

const addMessageQuery = async ({
                                   message
                               }: { message: Message }) => {
    const resp = await fetch(`/api/addMessage`, {
        method: "POST",
        body: JSON.stringify(message)
    })

    return await resp.json() as ChatMessageResponse;
}

export function ChatComponent({room}: { room: ChatRoom }) {
    const [validationErrorMessage, setValidationErrorMessage] = useState<string>("");
    const [chatMessages, setChatMessages] = useState<SyncedMessage[]>([]);

    const pathManager = usePathManager();

    const {data: session} = useSession();

    const msgBox = useRef<HTMLDivElement>(null);
    const textArea = useRef<HTMLTextAreaElement>(null);

    const router = useRouter();

    const currentChannel = useRoomStateStore(state => state.currentChannel);

    useEffect(() => {
        if (!room) {
            router.push("/");
            return;
        }

        document.addEventListener("keydown", (e) => {
            if (document.activeElement !== textArea.current && e.key === "/") {
                textArea.current?.focus();
                e.preventDefault();
            }
        });

        useRoomStateStore.getState().setCurrentChannel(room.name, (data) => {
            console.log(":): ", data);
        })

        return () => {
            const pusher = getCurrentPusherInstance();
            useRoomStateStore.getState().unsetCurrentRoom(room.name);
            pusher.unsubscribe(room.name);
            console.log("unsubscribed from channel", room.name);
        };
    }, []);

    const messageMutation = useMutation(["addMessage"], addMessageQuery);

    const addMessage = (message: SyncedMessage) => {
        message.isSynced = false;
        setChatMessages((prev) => [...prev, message]);
    }

    console.log("ChatComponent re-rendered.")

    if (!room) { // if error will occur try this: return redirecting, and check in useState if there is room, if not, then redirect
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
                authorId: currentUserId,
                content: e.target.value,
                clientUUID: uuid(),
                roomId: room.id,
            } as SyncedMessage;

            e.target.value = "";
            addMessage(message);

            try {
                messageMutation.mutateAsync({
                    message: {
                        ...message,
                        roomId: message.roomId
                    }
                }, {
                    onSuccess: () => {
                        console.log("Message sent!");
                    },
                    onError: (error) => {
                        // let errorMessages = JSON.parse(error.message) as TRPCClientError<AppRouter>[];
                        //
                        // let errorMessage = errorMessages.reduce((acc, error) => acc + error.message + ", ", "");
                        //
                        // errorMessage = errorMessage.substring(0, errorMessage.length - 2);

                        console.error(error);

                        const errorMessage = error.toString();

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

    if (!chatMessages) {
        console.error("Error receiving messages.");
    }

    return (
        <>
            <div className="h-full flex flex-col items-center">
                <div
                    className="h-[65vh] w-full card shadow-xl p-3 flex flex-col-reverse overflow-y-scroll"
                    id="messages"
                >
                    <div ref={msgBox}></div>
                    {/* TODO: change mechanism for auto scrolling - current contains bugs*/}
                    {chatMessages?.length == 0 ? (
                        <div className="grid place-items-center w-full h-full">
                            <p className="">No messages to show</p>
                        </div>
                    ) : (
                        chatMessages.map((message) => (
                            <SingleMessage
                                message={message}
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