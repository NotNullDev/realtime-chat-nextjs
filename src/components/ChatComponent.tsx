import { createRef, useEffect, useState } from "react";
import { MessageWithAuthor } from "../types/prisma";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";
import { TRPCContextState } from "@trpc/react/src/internals/context";
import { AppRouter } from "../server/router";
import SingleMessage from "./SingleMessage";
import {
  QueryClient,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "react-query";
import { useMessagesStore } from "../utils/stores";

export type SyncedMessage = MessageWithAuthor & {
  isSynced: boolean;
};

type ChatMessageResponse = {
  messages: MessageWithAuthor[];
  cursor: string;
};

const fetchMessages = async ({ queryKey }) => {
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
  const { addMessage, setMessages } = useMessagesStore((state) => state);
  const messages = useMessagesStore((state) => state.messages);

  const trpcContext = trpc.useContext();

  const queryClient = useQueryClient();

  //   const msgs = useQuery(["fetchMessages", 2], fetchMessages, {
  //     retry: 2,
  //     onSuccess(data) {
  //       console.log("onSuccess", data.messages);
  //       setMessages(data.messages);
  //     },
  //   });

  const { data: session } = useSession();

  const msgBox = createRef<HTMLDivElement>();

  useEffect(() => {
    scrollIntoView(msgBox);
  }, [msgBox]);

  useEffect(() => {
    if (messages.length === 0) {
      console.log("Fetching initial messages");
      queryClient
        .fetchQuery(["fetchMessages", 2], fetchMessages)
        .then((data) => {
          setMessages(data.messages);
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

    channel.bind("newMessage", function (data) {
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
    };

    e.target.value = "";

    messageMutation.mutateAsync(message, {
      onSuccess: () => {
        console.log("Message sent!");
      },
      onError: () => errorHandler(),
    });
  };

  //   if (msgs.isLoading) {
  //     return <div>Loading...</div>;
  //   }

  //   if (msgs.error) {
  //     return <div>Error reading messages from database.</div>;
  //   }

  if (!session?.user) {
    return <div>You are not logged in.</div>;
  }

  return (
    <>
      <div className="grid place-items-center">
        <div
          className="w-[40vw] h-[40vh] card shadow-xl p-3 flex flex-col-reverse overflow-y-scroll"
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
                key={message.id}
              />
            ))
          )}
        </div>
        <input
          onKeyDown={(e) => messageTextChangeHandler(e)}
          className="textarea textarea-bordered mt-2 w-1/2"
          type="text"
          placeholder="Ctrl + Enter to send message"
        />
        <div className="btn-group mt-2">
          <button className="btn" onClick={() => clearMessages(trpcContext)}>
            Clear
          </button>
          <button className="btn" onClick={() => scrollIntoView(msgBox)}>
            Scroll test
          </button>
          <button
            className="btn"
            // onClick={() =>{ socketIOClient.emit("kickAll")}}
          >
            Kick all
          </button>
        </div>
      </div>
    </>
  );
}

const scrollIntoView = (element: any) => {
  element.current?.scrollIntoView({ behavior: "smooth" });
};

function errorHandler() {
  alert("😯😯😯😯😯😯 Error! 😯😯😯😯😯😯");
}
