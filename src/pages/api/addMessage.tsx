import {NextApiRequest, NextApiResponse} from "next";
import pusher from "../../server/pusher";
import {Message} from "@prisma/client";
import {prisma} from "../../server/prisma";
import {ChatMessageResponse} from "../../types/appTypes";

import CONSTS from "../../utils/consts.json";

const addMessage = async (req: NextApiRequest, res: NextApiResponse) => {
    const result: ChatMessageResponse = {
        message: undefined,
        error: undefined
    }

    try {
        const newMessage: Message = JSON.parse(req.body) as Message;
        console.log("Received message:", newMessage);

        const newMessageWithId = await prisma?.message.create({
            data: {
                authorId: newMessage.authorId,
                content: newMessage.content,
                roomId: BigInt(newMessage.roomId),
                clientUUID: newMessage.clientUUID
            }, include: {
                room: true,
                author: true
            }
        })

        console.log("Message from the database:", newMessageWithId);

        // add to the database / republish to the ws channels

        await pusher.trigger(newMessageWithId.room.name, CONSTS.NEW_MESSAGE_CHANNEL, newMessageWithId);

        return res.status(200).json(newMessage)
    } catch (e) {
        console.error("error in /addMessage", e);
    }

    res.status(500).json(result);
}

export default addMessage;