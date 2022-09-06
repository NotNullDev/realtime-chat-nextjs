import {getSession} from "next-auth/react";
import {NextApiRequest, NextApiResponse} from "next";
import {randomUUID} from "crypto";
import {prisma} from "../../server/prisma";
import {unstable_getServerSession} from "next-auth";
import {authOptions} from "./auth/[...nextauth]";

const joinRoom = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const session = await unstable_getServerSession(req, res, authOptions)

        if (!session) {
            return res.status(401).json({
                secret: undefined,
                error: "Unauthorized"
            });
        }

        const isCurrentUser = session?.user;

        if (!isCurrentUser) {
            console.error("User is not the current user", session.user.id);
            return res.status(401).json({
                secret: undefined,
                error: "Unauthorized"
            });
        }

        const roomId = req.body.roomId;

        if (!roomId) {
            return res.status(422).json({
                secret: undefined,
                error: "Missing roomId, received: [" + req.body + "]"
            })
        }
        const secret = randomUUID();

        const response = await prisma.userRoomAuthReq.create({
            data: {
                roomId: BigInt(roomId),
                userId: session.user.id,
                secret: secret,
                expireTime: new Date(Date.now() + 1000 * 60 * 5)
            }
        })

        if (response.id == undefined) {
            return res.status(500).send("");
        }

        return res.status(200).json({
            secret: secret,
            error: undefined
        });
    } catch (e) {
        console.error(e);
    }
    return res.status(500).send("");
}


export default joinRoom;
