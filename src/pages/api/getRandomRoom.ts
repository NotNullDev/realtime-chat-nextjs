import {NextApiRequest, NextApiResponse} from "next";
import { prisma } from "../../server/prisma";

export default async (req: NextApiRequest,res: NextApiResponse) => {
    try {
        const count = await prisma?.room.count();

        console.log("Count of rooms: ", count);

        if (!count) {
            console.error("No rooms found! Count is 0");
            return res.status(404).send("");
        }

        const rand = 1 + Math.floor(Math.random() * count);

        console.log("Random room index: ", rand);

        const randomRoom = await prisma?.room.findFirst({
            where: {
                id: rand
            }
            })

        console.log("Random room: ", randomRoom);

        if (!randomRoom) {
            console.error("No random room found, rand: ", rand);
            return res.status(500).json({error: "No room found"});
        }

        return res.status(200).json(randomRoom);
    } catch (e) {
        console.error(e);
    }
    return res.status(500).send("");
}