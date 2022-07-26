import { Message } from "@prisma/client";
import { useSession } from "next-auth/react";

const SingleMessage = ({ message }: { message: Message }) => {
  const now: string = new Date(message.createdAt).toLocaleString();

  const heightInPx = 50;

  const { data: session } = useSession();

  const author = message.authorId === message.authorId;

  // const isOwnMessage = message.authorId === session?.user?.id;
  const isOwnMessage = false;

  const additionalStyle = isOwnMessage ? "place-items-end" : "";

  return (
    <div
      className={`flex flex-col w-full justify-between p-2 mb-2 ${additionalStyle}`}
    >
      <div className="flex">
        {!isOwnMessage && (
          <div className="font-semibold mr-3">{message.authorId}</div>
        )}
        <div className="">{now}</div>
      </div>
      <div className={`mt-1 grid w-1/2 h-[${heightInPx}px]`}>
        <div className={`p-3 flex items-center rounded-xl alert`}>
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default SingleMessage;
