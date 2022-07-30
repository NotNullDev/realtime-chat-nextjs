import create from "zustand";
import Pusher, { Channel } from "pusher-js";
import { Message } from "@prisma/client";
import { MessageWithAuthor } from "../types/prisma";
import { messagesRouter } from "../server/router/wsChat";
import zustand from "zustand";

export interface MessagesStore {
  messages: MessageWithAuthor[];
  addMessage: (newMessage: MessageWithAuthor) => void;
  setMessages: (newMessages: MessageWithAuthor[]) => void;
}

export const useMessagesStore = create<MessagesStore>()((set) => ({
  messages: [],
  addMessage: (newMessage: MessageWithAuthor) => {
    set((state) => {
      return {
        messages: [newMessage, ...state.messages],
      };
    });
  },
  setMessages: (newMessages: MessageWithAuthor[]) => {
    set((state) => {
      return {
        messages: newMessages,
      };
    });
  },
}));

// interface PusherStore {
//   pusher: Pusher;
//   messageChannel: Channel;
// }

// const usePusherStore = create<PusherStore>((state) => {
//   if (process.env.NODE_ENV === "development") {
//     Pusher.logToConsole = true;
//   }

//   const appKey = process.env.NEXT_PUBLIC_PUSHER_ID ?? "";

//   if (appKey === "") {
//     throw new Error("PUSHER_ID is not set");
//   }

//   const pusher = new Pusher(appKey, {
//     cluster: process.env.NEXT_PUBLIC_Pusher_CLUSTER ?? "",
//   });

//   if (process.env.NODE_ENV === "development") {
//     console.log("Created pusher with appKey:", appKey);
//     pusher.connection.bind("connected", () => {
//       console.log("[client] Pusher connected");
//     });
//     pusher.connection.bind("disconnected", () => {
//       console.log("[client] Pusher disconnected");
//     });
//   }

//   const channel = pusher.subscribe("chat");
//   channel.bind("newMessage", (data: any) => {
//     console.log("[client] Icomming message from the channel 'chat': ", data);
//   });

//   return {
//     pusher,
//     messageChannel: channel,
//   };
// });

// export default usePusherStore;
