import {Message, User} from "@prisma/client";
import { useSession } from "next-auth/react";
import {MessageWithAuthor} from "../types/prisma";
import {SyncedMessage} from "./ChatComponent";

const SingleMessage = ({ message, currentUser }: { message: SyncedMessage, currentUser: User }) => {

  if (!currentUser) {
    return null;
  }

  const createdAt = message.createdAt;

  const now: string = `${new Date(createdAt).toLocaleDateString()} ${new Date(createdAt).toLocaleTimeString()}`;

  const heightInPx = 50;


  if ( message.author == null) {
    return <div>Error! Author is null. </div>
  }

  const authorName = (message?.author?.name === currentUser.name ? "You" : message.author.name) ?? "Unknown";

  const isOwnMessage = message.author.id === currentUser.id;

  const additionalStyle = isOwnMessage ? "place-items-end" : "";

  const isSynced = message.isSynced;

  return (
    <div
      className={`flex flex-col w-full justify-between p-2 mb-2 ${additionalStyle}`}
    >
      <div className="flex">
        {!isOwnMessage && (
          <div className="font-semibold mr-3">{authorName}</div>
        )}
        <div className="">{now}</div>
      </div>
      <div className={`mt-1 grid w-1/2 h-[${heightInPx}px] indicator`}>
        <div className={`p-3 flex items-center rounded-xl alert`}>
          {message.content}
          { !isSynced && isOwnMessage &&
                <div data-tip="hello" className={`h-6 w-6 indicator-item indicator-start indicator-bottom`} >
                  <svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="tooltip tooltip-left absolute w-full h-full" data-tip="Not synced"></div>
              </div>

        }
          { isSynced && isOwnMessage &&
              <div className="h-5 w-5 indicator-item indicator-start indicator-bottom fill-neutral-content">
                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 20 20" >
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="tooltip tooltip-left absolute w-full h-full" data-tip="Synced"></div>
              </div>
          }
        </div>
      </div>
    </div>
  );
};

export default SingleMessage;
