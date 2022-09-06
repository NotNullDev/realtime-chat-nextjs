import {NextApiRequest, NextApiResponse} from "next";
import {getToken} from "next-auth/jwt";

const getJWT = async (req: NextApiRequest,res: NextApiResponse ) => {
    const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

    if (!token) {
        console.log(req.headers)
        return res.status(404).send("");
    }

    return res.status(200).send(token);
}

export default getJWT;