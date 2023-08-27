import jwt from "jsonwebtoken";
import { User } from "../models/user/user-model";
import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";

interface Decoded {
    email: string;
}
export async function getUserfromToken(req: any) {

    const token = req.headers.authorization
    if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string, {
            algorithms: ["HS256"]
        }) as Decoded;

        const user = await User.findOne({
            where: {
                email: decoded.email
            },
            attributes: { exclude: ["password"] }
        })

        return user?.dataValues

    }
    return null;
}