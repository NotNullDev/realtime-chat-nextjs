import {NextApiRequest, NextApiResponse} from "next";
import pusher from "../../server/pusher";
import {Message} from "@prisma/client";
import {prisma} from "../../server/prisma";

const addMessage = async (req: NextApiRequest, res: NextApiResponse) => {
    const newMessage: Message =  req.body;

    console.log("Received message:", newMessage);

    let newMessageWithId : undefined | Message = undefined;


    try {
        newMessageWithId = await prisma?.message.create({
            data: {
                ...newMessage,
            }, include: {
                room: true,
                author: true
            }
        })
    } catch (e) {
        res.status(500).json({error: e.message});
        console.log("Error:", e);
        return;
    }

    console.log("MSg from server: ", newMessageWithId);

    // add to the database / republish to the ws channels

    res.status(200).json(newMessage)
}

export default  addMessage;