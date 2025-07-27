// import bcrypt from "bcrypt";
// import { usersRepository } from "../users/repositories/usersRepository";
// import {userService} from "../users/application/userService";
//
// export const authService = {
//   async checkCredentials(
//     loginOrEmail: string,
//     password: string,
//   ): Promise<boolean> {
//     const user = await userService.findByLoginOrEmail(loginOrEmail);
//
//     if (!user) {
//       return false;
//     }
//
//     const isMatch = await bcrypt.compare(password, user.password);
//     return isMatch;
//   },
// };
