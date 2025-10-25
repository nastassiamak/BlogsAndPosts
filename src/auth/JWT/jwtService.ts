import jwt from "jsonwebtoken";
import {SETTINGS} from "../../core/settings/settings";
import {MeViewModel} from "./me";

export const jwtService = {
    async generateToken(user: MeViewModel) {
        const token =
            jwt
                .sign({userId: user.userId}, SETTINGS.JWT_SECRET, { expiresIn: "1h" });
        return token;
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, SETTINGS.JWT_SECRET) ;
            return result.userId;
        } catch (error) {
            return null;
        }
    },
};