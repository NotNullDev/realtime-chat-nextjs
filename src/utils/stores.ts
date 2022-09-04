import {Message, User} from "@prisma/client";
import create from "zustand";
import {SyncedMessage} from "../components/ChatComponent";
import {ChatRoom} from "../types/prisma";
import Pusher, {Channel} from "pusher-js";

import  CONST_MESSAGES from "../utils/consts.json"

let pusher : Pusher | undefined= undefined;

export const getCurrentPusherInstance = () => {
    pusher = Pusher.instances[0];

    if (!pusher) {
        Pusher.logToConsole = false;
        pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || "", {
            httpHost: process.env.NEXT_PUBLIC_PUSHER_HOST || "",
            wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST || "",
            statsHost: process.env.NEXT_PUBLIC_PUSHER_HOST || "",
            httpPort: parseInt(process.env.NEXT_PUBLIC_PUSHER_PORT ?? "3000"),
            wsPort: parseInt(process.env.NEXT_PUBLIC_PUSHER_PORT ?? "3000"),
            wssPort: parseInt(process.env.NEXT_PUBLIC_PUSHER_PORT ?? "3000"),
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "eu",
            forceTLS: false,
            ignoreNullOrigin: true,
            enabledTransports: ['ws', 'wss'],
        })
    }

    return pusher;
}

export interface MessagesStore {
    messages: SyncedMessage[];
    addMessage: (newMessage: SyncedMessage) => void;
    setMessages: (newMessages: SyncedMessage[]) => void;
}

export const useMessagesStore = create<MessagesStore>()((set) => ({
    messages: [],
    addMessage: (newMessage: SyncedMessage) => {
        set((state) => {
            const indexOfDuplicate = state.messages.findIndex(
                (message) => message.clientUUID === newMessage.clientUUID
            );

            if (indexOfDuplicate !== -1) {
                const messages = state.messages;
                newMessage.isSynced = true;
                messages[indexOfDuplicate] = newMessage;
                return {
                    messages,
                };

            }

            return {
                messages: [newMessage, ...state.messages],
            };
        });
    },
    setMessages: (newMessages: SyncedMessage[]) => {
        set((state) => {
            return {
                messages: newMessages,
            };
        });
    },
}));

export interface RoomStore {
    currentRoom: ChatRoom | undefined
    channel: Channel | undefined;
    setCurrentRoom: (newRoomName: ChatRoom) => void;
    addRawMessage: (newMessage: Message, synced?: boolean) => void;
    currentRoomMessages: SyncedMessage[],
    setNewMessageCallback: (callback: Function) => void;
    setChannel: (channel: Channel) => void;
    setMessages: (messages: SyncedMessage[]) => void;
}

const aa = () => {
    console.error("wtf!???");
}

interface RoomState {
    currentRoomName: string | undefined;
    currentChannel: Channel | undefined;
    setCurrentChannel: (roomName: string, callback: (data) => void) => boolean;
    unsetCurrentRoom: (roomName: string) => boolean;
}

export const useRoomStateStore = create<RoomState>()((set) => ({

    currentRoomName: undefined,

    currentChannel: undefined,

    setCurrentChannel: (roomName: string, callback: (data) => void) => {
        set(state => {
            if (state.currentChannel) {
                console.log("Warning: trying to set current channel while another channel is already set. Please unsubscribe first.");
                throw new Error("Warning: trying to set current channel while another channel is already set. Please unsubscribe first.");
                return {
                    ...state
                }
            }

            const channel = getCurrentPusherInstance()
                .subscribe(roomName);

            channel.bind(CONST_MESSAGES.NEW_MESSAGE_CHANNEL, (data) => {
                console.log("RECEIVED FROM WEBSOCKET SERVER: ", data);
                callback(data);
            });

            console.log("Subscribed to channel: ", channel);

            return {
                ...state,
                currentChannel: channel,
            };
        })

        return true;
    },

    unsetCurrentRoom: (roomName: string) => {
        set((state) => {
            if (state.currentChannel) {
                state.currentChannel.unbind_all();
            }

            return {
                ...state,
                currentChannel: undefined
            }
        })

        return true;
    }

}));

export const useRoomStore = create<RoomStore>()((set) => ({
    currentRoom: undefined,
    currentRoomMessages: [],
    channel: undefined,
    setMessages: (messages) => {
        messages = messages.reverse();

        set(state => {
            return {
                currentRoomMessages: [...messages]
            }
        }, true);
    },
    setChannel: (channel) => {
        set(state => {
            return {
                ...state,
                channel
            }
        })
    },
    setNewMessageCallback: (callback: Function) => {
        // console.log("Not really!")
    },
    addRawMessage: (newMessage,synced =  true) => {
        set(state => {
            let newMessages = state.currentRoomMessages.filter(msg => msg.clientUUID != newMessage.clientUUID);

            let newMessageSynced = {
                ...newMessage,
                isSynced: synced
            } as SyncedMessage

            newMessages = [newMessageSynced, ...newMessages];

            return {
                ...state,
                currentRoomMessages: [...newMessages]
            }
        })
    },
    setCurrentRoom: (newRoom: ChatRoom) => {
        set((state) => {

                return {
                    ...state,
                    currentRoom: newRoom,
                };
            }
        );
    }
}));

export interface ThemeStore {
    theme: string;
    toggleTheme: () => void;
    setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeStore>()((set) => ({
    theme: "light",
    toggleTheme: () => {
        set((state) => {
            return {
                theme: state.theme === "light" ? "dark" : "light",
            };
        });
    },
    setTheme: (theme: string) => {
        set(state => {
            state.theme = theme;
            return state;
        })
    }
}));

export interface AnonymousUser {
    username: string;
}

export interface UserStore {
    user: User | undefined;
    anonymousUser: AnonymousUser;
    setUser: (newUser: User) => void;
    setAnonymousUser: (newAnonymousUser: AnonymousUser) => void;
}

export const useUserStore = create<UserStore>()((set) => ({
    user: undefined,
    anonymousUser: {
        username: "RandomBalunga35"
    },
    setUser: (newUser: User) => {
        set((state) => {
                return {
                    ...state,
                    user: newUser,
                };
            }
        );
    },
    setAnonymousUser: (newAnonymousUser: AnonymousUser) => {
        set((state) => {
                return {
                    ...state,
                    anonymousUser: newAnonymousUser,
                };
            }
        );
    }
}));