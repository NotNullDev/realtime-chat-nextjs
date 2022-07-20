import { Message } from "@prisma/client";

const SingleMessage = ({ message }: { message: Message }) => {
  const now: string = new Date(message.createdAt).toLocaleString();

  const heightInPx = 50;

  return (
    <div className="flex flex-col w-full justify-between p-2 mb-2">
      <div className="flex">
        <div className="font-semibold mr-3 mb-1">{message.author}</div>
        <div>{now}</div>
      </div>
      <div className={`grid w-1/2 h-[${heightInPx}px]`}>
        <div className="p-3 border-yellow-600 border-2 bg-yellow-400 rounded-xl">
          {message.content}
        </div>
      </div>
    </div>
  );
};

export default SingleMessage;
