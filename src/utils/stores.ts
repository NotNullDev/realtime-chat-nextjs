import {Message, User} from "@prisma/client";
import create from "zustand";
import {SyncedMessage} from "../components/ChatComponent";
import {ChatRoom} from "../types/prisma";
import Pusher, {Channel} from "pusher-js";

export const getCurrentPusherInstance = () => {
    let pusher = Pusher.instances[0];

    if (!pusher) {
        Pusher.logToConsole = false;
        pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY || "", {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "eu",
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
    addRawMessage: (newMessage: Message) => void;
    currentRoomMessages: SyncedMessage[],
    setNewMessageCallback: (callback: Function) => void;
    setChannel: (channel: Channel) => void;
}

const aa  = () => {
    console.error("wtf!???");
}

export const useRoomStore = create<RoomStore>()((set) => ({
    currentRoom: undefined,
    currentRoomMessages: [],
    channel: undefined,
    setChannel: (channel) => {
        set(state => {
            return {
                ...state,
                channel
            }
        })
    },
    setNewMessageCallback: (callback: Function) => {
      // console.log("Not realy!")
    },
    addRawMessage: (newMessage) => {
       set(state => {

           const newMessages = state.currentRoomMessages.filter(msg => msg.clientUUID != newMessage.clientUUID);

           let newMessageSynced = {
               ...newMessage,
               isSynced: true
           } as SyncedMessage

           newMessages.push(newMessageSynced);

            return {
                ...state,
                newMessages
            }
        })
    },
    setCurrentRoom: (newRoom: ChatRoom) => {
        set((state) => {

                if (!newRoom) {
                    console.error("Treind to add non-existing room");
                    return {
                        ...state
                    };
                }

                if (state.channel) {
                    state.channel.unbind_all();
                    state.channel.unsubscribe();
                }

                const pusher = getCurrentPusherInstance();

                if (!pusher) {
                    throw new Error("Pusher can not be initialized!");
                }

                let channelName = newRoom.name;

                if (newRoom.isPrivate) {
                    channelName = "private-" + channelName;
                }

                console.log("Created subscription for channel: " + channelName);

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