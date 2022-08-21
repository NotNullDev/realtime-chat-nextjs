// src/pages/api/examples.ts
import type {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../server/prisma";
import {MessageWithAuthor} from "../../types/prisma";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  const cursor = req.query.cursor;

  let messages: MessageWithAuthor[] | undefined;

  if (!cursor) {
    return res.status(400).json({
      error: "Missing cursor",
    });
  }

  try {
    messages = await prisma.message.findMany({
      include: {
        author: true,
        room: true,
      },
      take: 10,
      orderBy: {
        id: "desc",
      },
    });
  } catch (exp) {
    console.error(exp);
  }

  if (!messages) {
    return res.status(500).json({
      error: "Internal server error",
    });
  }

  const response = {
    messages,
    nextCursor: cursor ?? messages.length ?? 1,
  };

  res.status(200).json(response);
};

export default examples;
