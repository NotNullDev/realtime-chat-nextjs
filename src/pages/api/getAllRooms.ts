import {NextApiRequest, NextApiResponse} from "next";

export default async (req: NextApiRequest,res: NextApiResponse) => {

    const allRooms = await prisma?.room.findMany({
        include: {
            activeUsers: true,
        }
    });

    console.log("All rooms from database: ", allRooms);

    return res.status(200).json(allRooms);
}