import {NextApiRequest, NextApiResponse} from "next";
import pusher from "../../../server/pusher";

export default (req: NextApiRequest, res: NextApiResponse) => {

    const {channel_name, socket_id} = req.query;

    if ( !channel_name || !socket_id || typeof socket_id !== "string" || typeof channel_name !== "string") {
        return res.status(403).json({
            error: "Missing channel_name or socket_id"
        });
    }

    const auth = pusher.authorizeChannel(socket_id, channel_name);

    console.log("Send auth", auth);

    res.send(auth);
}