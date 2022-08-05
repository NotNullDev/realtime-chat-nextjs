import {NextApiResponse} from "next";

const collabServer = (req: NextApiResponse , res: NextApiResponse ) => {

    return res.status(200).json({
            url: process.env.COLAB_SERVER_URL ?? "",
            pooling: process.env.POOLING_SERVER_ENABLED ?? false
        }
    );

}

export default collabServer;