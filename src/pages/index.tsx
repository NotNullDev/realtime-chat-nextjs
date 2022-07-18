import { Message } from "@prisma/client";
import type { NextPage } from "next";
import { createRef, useRef, useState } from "react";
import { trpc } from "../utils/trpc";

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

export type ChatMessage = {
  author: string;
  content: string;
  timestamp: Date;
};

const Home: NextPage = () => {
  const utils = trpc.useContext();

  const messagesQuery = trpc.useQuery(["example.getAll"]);
  const messageMutation = trpc.useMutation("example.addMessage");
  const deleteAllMsgMutation = trpc.useMutation("example.deleteAll");
  if (messagesQuery.isLoading) {
    return <div>Loading...</div>;
  }

  const messages = messagesQuery.data as Message[];

  const msgBox = createRef<HTMLElement>();

  const username = "John Doe";

  const handleError = () => {
    alert("😯😯😯😯😯😯 Error! 😯😯😯😯😯😯");
  };

  const handleMessage = (e: any) => {
    console.log(typeof e);
    if (e.key.toLowerCase() !== "enter") {
      return;
    }
    messageMutation.mutateAsync(
      {
        author: "John Doe",
        content: e.target.value,
      },
      {
        onSuccess: () => {
          utils.invalidateQueries("example.getAll");
          e.target.value = "";
          msgBox.current?.scrollIntoView({ behavior: "smooth" });
        },
        onError: () => handleError(),
      }
    );
  };

  const clear = () => {
    deleteAllMsgMutation.mutateAsync(null, {
      onSuccess: () => {
        alert("OMG WHERE ARE ALL THE MESSAGES? 🤔");
        utils.invalidateQueries("example.getAll");
      },
      onError: () => handleError(),
    });
  };

  return (
    <>
      <div className="grid place-items-center h-[100vh] bg-indigo-500">
        <div className="grid place-items-center">
          <div
            className="w-[40vw] h-[40vh] border-black border-2 rounded p-3 flex flex-col overflow-y-scroll"
            id="messages"
            ref={msgBox}
          >
            {messages.map((message) => (
              <div
                className="flex flex-col border-yellow-400 border-2 rounded p-1 my-2"
                key={message.createdAt.getMilliseconds() % 10032}
              >
                <div className="place-self-end">
                  <p>{message.author}</p>
                  <p>
                    {message.createdAt.getHours()}:
                    {message.createdAt.getMinutes()}:
                    {message.createdAt.getSeconds()}
                  </p>
                </div>
                <br />
                <p>{message.content}</p>
              </div>
            ))}
          </div>
          <input
            onKeyDown={handleMessage}
            className="mt-2 w-full rounded focus:border-none p-1"
            type="text"
            placeholder="Hello!"
          />
          <button onClick={() => clear()}>Clear</button>
        </div>
      </div>
    </>
  );
};
export default Home;
