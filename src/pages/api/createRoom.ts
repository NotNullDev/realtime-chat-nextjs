import {NextApiRequest, NextApiResponse} from "next";
import {prisma} from "../../server/prisma";
import {RandomRoomResponse} from "../../types/appTypes";
import {ChatRoom} from "../../types/prisma";

const CreateRoomApi = async (req: NextApiRequest, res: NextApiResponse) => {
    const result: RandomRoomResponse = {
        room: undefined,
        error: undefined
    }

    const {
        ownerId,
        roomName,
        isPrivate
    } = req.body;

    if (!ownerId || !roomName || isPrivate === undefined) {
        result.error = `Missing parameters! ${ownerId} ${roomName} ${isPrivate}`;
        console.error(result.error);
        return res.status(400).json(result);
    }

    try {
        const createdRoom = await prisma.room.create({
            data: {
                ownerId,
                name: roomName,
                isPrivate
            }
        });

        if (!createdRoom) {
            result.error = "Could not create room!";
            console.error(result.error);
            return res.status(500).send(result);
        }

        result.room = createdRoom as ChatRoom; // same as in getRandomRoom.ts
        return res.status(200).json(result);
    } catch (e) {
        console.error("/api/createRoom: ", e);
    }

    result.error = "Something went wrong :(";
    return res.status(500).send(result);
}

export default CreateRoomApi;