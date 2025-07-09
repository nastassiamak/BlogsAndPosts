import {usersRepository} from "../users/repositories/usersRepository";
import bcrypt from "bcrypt";

export const authService = {
    async checkCredentials(loginOrEmail: string, password: string) {
        console.log("Checking credentials for:", loginOrEmail);
        const user = await usersRepository.findByLoginOrEmail(loginOrEmail);
        if (!user) {
            console.log("User not found");
            return false;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Input password:", password);
        console.log("User hashed password from DB:", user.password);
        console.log("Password comparison result:", isMatch);
        return isMatch;

    }
}