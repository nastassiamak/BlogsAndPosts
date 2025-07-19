import { User } from "../domain/user";
import { usersRepository } from "../repositories/usersRepository";
import { WithId } from "mongodb";
import { UserQueryInput } from "../routers/input/userQueryInput";
import { UserListPaginatedOutput } from "../routers/output/userListPaginatedOutput";
import bcrypt from "bcrypt";
import { UserCreateInput } from "../routers/input/userCreateInput";
import { userCollection } from "../../db/mongoDb";
import { BusinessRuleError } from "../../core/errors/businessRuleError";

export const userService = {
  async findMany(queryDto: UserQueryInput): Promise<UserListPaginatedOutput> {
    return await usersRepository.findMany(queryDto);
  },

  async create(input: UserCreateInput): Promise<string> {
    // Проверка уникальности логина
    const existingLogin = await userCollection.findOne({ login: input.login });
    if (existingLogin) {
      throw new BusinessRuleError({
        errorsMessages: [{ field: "login", message: "login should be unique" }],
      });
    }

    // Проверка уникальности email
    const existingEmail = await userCollection.findOne({ email: input.email });
    if (existingEmail) {
      throw new BusinessRuleError({
        errorsMessages: [{ field: "email", message: "email should be unique" }],
      });
    }

    // Хеширование пароля
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(input.password, passwordSalt);

    const newUser: User = {
      login: input.login,
      email: input.email,
      password: passwordHash,
      createdAt: new Date().toISOString(),
    };

    return await usersRepository.createUser(newUser);
  },

  async _generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  },

  async findByLoginOrEmail(loginOrEmail: string): Promise<WithId<User>> {
    const res = await usersRepository.findByLoginOrEmail(loginOrEmail);
    if (!res) {
      throw new BusinessRuleError({
        errorsMessages: [{ field: "login", message: "login should be unique" },
          {field: "email", message: "email should be unique" },],
      })
    }
    return res;
  },

  async findByIdOrFail(id: string): Promise<WithId<User>> {
    return await usersRepository.findByIdOrFail(id);
  },

  async delete(id: string): Promise<void> {
    return await usersRepository.deleteUser(id);
  },
};
