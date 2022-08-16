// src/pages/api/examples.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../server/prisma";
import { MessageWithAuthor } from "../../types/prisma";

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  const cursor = req.query.cursor;

  if (!cursor) {
    return res.status(400).json({
      error: "Missing cursor",
    });
  }

  const messages: MessageWithAuthor[] | undefined =
    await prisma.message.findMany({
      include: {
        author: true,
        room: true
      },
      take: 10,
      orderBy: {
        id: "desc"
      },
      // where: {
      //   id: {
      //     gt: BigInt(cursor.toString()) as any, // due to some prisma but in current version
      //   },
      // },
    });

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
