import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../server/prisma";

const verifyAuthorization = async (req: NextApiRequest, res: NextApiResponse) => {
    const {secret, userId, roomId} = req.body;

    if (secret == undefined || userId == undefined || roomId == undefined) {
        return res.status(404).json({});
    }

    const secretInDB = await prisma.userRoomAuthReq.findFirst({
        where: {
            secret: secret,
            userId: userId,
            roomId: roomId,
            expireTime: {
                lt: new Date()
            }
        },
    });

    if (secretInDB) {
        return res.status(200).json({});
    }

    return res.status(401).json({});
}

export default verifyAuthorization;