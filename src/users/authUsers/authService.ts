import bcrypt from "bcrypt";
import { usersRepository } from "../repositories/usersRepository";

export const authService = {
  async checkCredentials(
    loginOrEmail: string,
    password: string,
  ): Promise<boolean> {
    const user = await usersRepository.findByLoginOrEmail(loginOrEmail);

    if (!user) {
      return false;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch;
  },
};
