import {NextApiRequest, NextApiResponse} from "next";

const getChannels = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("Someone queried channels!");
    return prisma?.room.findMany();
}

export default getChannels;