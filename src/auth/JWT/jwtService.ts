import jwt from "jsonwebtoken";
import { SETTINGS } from "../../core/settings/settings";
import { MeViewModel } from "./me";
import { User } from "../../users/domain/user";
import { UserDataOutput } from "../../users/routers/output/userDataOutput";

export const jwtService = {
  async generateToken(user: UserDataOutput) {
    const token = jwt.sign({ userId: user.id }, SETTINGS.JWT_SECRET, {
      expiresIn: "1h",
    });
    return token;
  },

  async getUserIdByToken(token: string) {
    try {
      const result: any = jwt.verify(token, SETTINGS.JWT_SECRET);
      return result.userId;
    } catch (error) {
      return null;
    }
  },
};
