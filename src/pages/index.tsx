import { Message, User } from "@prisma/client";
import type { NextPage } from "next";
import { createRef, useEffect, useMemo, useRef, useState } from "react";
import SingleMessage from "../components/SingleMessage";
import { trpc } from "../utils/trpc";
import { TRPCContextState } from "@trpc/react/src/internals/context";
import { AppRouter } from "../server/router";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";
import { MessageWithAuthor } from "../types/prisma";
import { ChatComponent } from "../components/ChatComponent";

// let socketIOClient = io(`ws://localhost:3001`);

const SingInComponent = () => {
  return <div className="p-3">You are not logged in!</div>;
};

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  const trpcContextState = trpc.useContext();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <main className="grid place-items-center flex-1 ">
      {session && <ChatComponent />}
      {!session && <SingInComponent />}
    </main>
  );
};

export default Home;
