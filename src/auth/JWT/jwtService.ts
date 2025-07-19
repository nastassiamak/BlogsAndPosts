import jwt from "jsonwebtoken";
import {SETTINGS} from "../../core/settings/settings";
import {JwtPayload} from "./JwtPayload";

export const jwtService = {
    generateToken(payload: JwtPayload) {
        return jwt.sign(payload, SETTINGS.JWT_SECRET, { expiresIn: "1h" });
    },

    verifyToken(token: string) {
        try {
            return jwt.verify(token, SETTINGS.JWT_SECRET) as JwtPayload;
        } catch (error) {
            return null;
        }
    },
};