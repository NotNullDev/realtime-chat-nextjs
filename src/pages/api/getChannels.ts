import {NextApiRequest, NextApiResponse} from "next";
import { prisma } from "../../server/prisma";

const getChannels = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("Someone queried channels!");
    return prisma?.room.findMany();
}

export default getChannels;