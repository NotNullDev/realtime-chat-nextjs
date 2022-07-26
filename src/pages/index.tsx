import { Message, User } from "@prisma/client";
import type { NextPage } from "next";
import { createRef, useEffect, useMemo, useRef, useState } from "react";
import SingleMessage from "../components/singleMessage";
import { trpc } from "../utils/trpc";
import { TRPCContextState } from "@trpc/react/src/internals/context";
import { AppRouter } from "../server/router";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";

// let socketIOClient = io(`ws://localhost:3001`);

function ChatComponent({ trpcContext }: { trpcContext: any }) {
  const [messages, setMessages] = useState<Message[]>([]);

  const utils = trpc.useContext();

  const getAllQuery = trpc.useQuery(["example.getAll"], {
    onSuccess: (data) => {
      setMessages(data);
    },
  });

  //const channel = usePusherStore((state) => state.messageChannel);
  const { data: session } = useSession();

  const msgBox = createRef<HTMLDivElement>();

  useEffect(() => {
    scrollIntoView(msgBox);
  }, [msgBox]);

  useEffect(() => {
    Pusher.logToConsole = true;

    var pusher = new Pusher("266ceafac0f9727d92b7", {
      cluster: "eu",
    });

    var channel = pusher.subscribe("chat");
    channel.bind("newMessage", function (data) {
      // setMessages((oldMessages) => [...oldMessages, data]);
      console.log("[client] Received message: ", channel);
      utils.invalidateQueries("example.getAll");
      scrollIntoView(msgBox);
    });
  }, []);

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

    const currentUser: User = session?.user as User;

    const message = {
      authorId: currentUser.id,
      content: e.target.value,
    };

    messageMutation.mutateAsync(message, {
      onSuccess: () => {
        console.log("[client] Message saved to the database.");
        // trpcContext.invalidateQueries("example.getAll");
        e.target.value = "";
        // msgBox.current?.scrollIntoView({ behavior: "smooth" });
      },
      onError: () => errorHandler(),
    });
  };

  if (getAllQuery.isLoading) {
    return <div>Loading</div>;
  }

  if (!messages) {
    return <div>Error reading messages from database.</div>;
  }

  return (
    <>
      <div className="grid place-items-center">
        <div
          className="w-[40vw] h-[40vh] card shadow-xl p-3 flex flex-col overflow-y-scroll"
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

const SingInComponent = () => {
  return <div className="p-3">You are not logged in!</div>;
};

const scrollIntoView = (element: any) => {
  element.current?.scrollIntoView({ behavior: "smooth" });
};

function errorHandler() {
  alert("😯😯😯😯😯😯 Error! 😯😯😯😯😯😯");
}

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  const trpcContextState = trpc.useContext();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <main className="grid place-items-center flex-1 ">
      {session && <ChatComponent trpcContext={trpcContextState} />}
      {!session && <SingInComponent />}
    </main>
  );
};

export default Home;
