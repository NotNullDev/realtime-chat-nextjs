// src/pages/api/examples.ts
import type {NextApiRequest, NextApiResponse} from "next";
import {MessageWithAuthor} from "../../types/prisma";
import { prisma } from "../../server/prisma";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const examples = async (req: NextApiRequest, res: NextApiResponse) => {

  let messages: MessageWithAuthor[] | undefined;

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
  };

  res.status(200).json(response);
};

export default examples;
