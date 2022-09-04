import {NextApiRequest, NextApiResponse} from "next";
import { prisma } from "../../server/prisma";


export default async (req: NextApiRequest,res: NextApiResponse) => {
try {
    const allRooms = await prisma?.room.findMany({
        include: {
            activeUsers: true,
        }
    });

    console.log("All rooms from database: ", allRooms);

    return res.status(200).json(allRooms);
} catch (e) {
    console.error(e);
    return res.status(500).send("");
}
}