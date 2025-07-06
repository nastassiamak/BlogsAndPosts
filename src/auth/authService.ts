import {usersRepository} from "../users/repositories/usersRepository";
import bcrypt from "bcrypt";

export const authService = {
    async checkCredentials(loginOrEmail: string, password: string) {
        const user =
            await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) {
            return false;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch;
    },
}