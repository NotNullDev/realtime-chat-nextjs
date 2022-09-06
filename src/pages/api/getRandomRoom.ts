import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../server/prisma";
import {RandomRoomResponse} from "../../types/appTypes";
import {ChatRoom} from "../../types/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const responseData: RandomRoomResponse = {
        error: undefined,
        room: undefined
    };

    try {
        const count = await prisma?.room.count();

        console.log("Count of rooms: ", count);

        if (!count) {
            console.error("No rooms found! Count is 0");
            responseData.error = "No rooms found!";
            return res.status(404).send(responseData);
        }

        const rand = 1 + Math.floor(Math.random() * count);

        const randomRoom = await prisma?.room.findFirst({
            where: {
                id: rand
            }
        })

        if (!randomRoom) {
            console.error("No random room found, rand: ", rand);
            return res.status(500).json({error: "No room found"});
        }

        responseData.room = randomRoom as ChatRoom; // TODO: It doesn't feel right, maybe we need additional types?
        return res.status(200).json(responseData);
    } catch (e) {
        console.error("/api/getRandomRoom: ",e);
    }


    return res.status(500).send(responseData);
}