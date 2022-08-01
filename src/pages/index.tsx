import type { NextPage } from "next";
import {createRef, lazy, useEffect, useMemo, useRef, useState} from "react";
import { trpc } from "../utils/trpc";
import { useSession } from "next-auth/react";
import { ChatComponent } from "../components/ChatComponent";
import {Suspense} from "preact/compat";
import EmbeddedExcalidraw from "../components/EmbeddedExcalidraw";

// let socketIOClient = io(`ws://localhost:3001`);

const SingInComponent = () => {
  return <div className="p-3">You are not logged in!</div>;
};

const Home: NextPage = () => {
  const { data: session, status } = useSession();

  // const Excalidraw = null;

  const trpcContextState = trpc.useContext();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if ( !session) {
    return <SingInComponent />;
  }

  return (
    <main className="grid place-items-center flex-1 ">
      <div className="flex w-full h-full m-0 " >
        <div className="flex-[2]">
            <EmbeddedExcalidraw />
        </div>
        <div className="flex-[1] p-4">
          <ChatComponent/>
        </div>
      </div>
    </main>
  );
};

export default Home;
