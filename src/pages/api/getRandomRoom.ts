import {NextApiRequest, NextApiResponse} from "next";

export default async (req: NextApiRequest,res: NextApiResponse) => {

    let randomRoom : undefined | any = undefined;
    let rand = 0;
    try {
        const count = await prisma?.room.count();

        console.log("Count of rooms: ", count);

        if (!count) {
            return res.status(500);
        }

        rand = 1 + Math.floor(Math.random() * count);

        console.log("Random room index: ", rand);

        randomRoom = await prisma?.room.findFirst({
            where: {
                id: rand
            }
        })
    } catch (e) {
        return res.status(500).json({error: e.message});
    }

    console.log("Random room: ", randomRoom);

    if (!randomRoom) {
        console.error("No random room found, rand: ", rand);
        return res.status(500).json({error:"No room found"});
    }

    return res.status(200).json(randomRoom);
}