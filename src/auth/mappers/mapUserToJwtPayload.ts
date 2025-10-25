import {WithId} from "mongodb";
import {User} from "../../users/domain/user";
import {JwtPayload} from "../JWT/JwtPayload";


export function mapUserToJwtPayload(user: WithId<User>): JwtPayload {
    return {
        userId: user._id.toString(),
        login: user.login,
        email: user.email
    }
}