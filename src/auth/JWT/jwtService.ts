import jwt from "jsonwebtoken";
import {SETTINGS} from "../../core/settings/settings";
import {User} from "../../users/domain/user";
import {ObjectId} from "mongodb";
import {UserAttributes} from "../../users/application/dtos/userAttributes";
import {UserDataOutput} from "../../users/routers/output/userDataOutput";
import {JwtPayload} from "./JwtPayload";

export const jwtService = {
    async generateToken(user: UserDataOutput) {
        const token =
            jwt
                .sign({userId: user.id}, SETTINGS.JWT_SECRET, { expiresIn: "1h" });
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