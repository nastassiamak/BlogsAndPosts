import {UserAttributes} from "./dtos/userAttributes";
import {User} from "../domain/user";
import {usersRepository} from "../repositories/usersRepository";
import {ObjectId, WithId} from "mongodb";
import {UserQueryInput} from "../routers/input/userQueryInput";
import {UserListPaginatedOutput} from "../routers/output/userListPaginatedOutput";
import bcrypt from "bcrypt";
import {UserCreateInput} from "../routers/input/userCreateInput";
import {userCollection} from "../../db/mongoDb";
import {BusinessRuleError} from "../../core/errors/businessRuleError";

export const userService = {

    async findMany(queryDto: UserQueryInput): Promise<UserListPaginatedOutput> {
        return await usersRepository.findMany(queryDto);
    },

    async create(input: UserCreateInput): Promise<string> {
        // Проверка уникальности login
        const existingLogin =
            await userCollection.findOne({login: input.login});
        if (existingLogin) {
            throw new BusinessRuleError({
                errorsMessages: [{ field: "login", message: "login should be unique" }],
            });
        }
        // Проверка уникальности email
        const existingEmail =
            await userCollection.findOne({email: input.email});
        if (existingEmail) {
            throw new BusinessRuleError({
                errorsMessages: [{field: "email", message: "email should be unique"}],
            });
        }

        const passwordSalt = await bcrypt.genSalt(10);
        const passwordHash =
            await this._generateHash(input.password, passwordSalt);
        const newUser: User = {
            login: input.login,
            email: input.email,
            password: passwordHash,
            createdAt: new Date().toISOString(),

        }
        return await usersRepository.createUser(newUser);
        //const result = await userCollection.insertOne(newUser);
        //return result.insertedId.toHexString(); // возвращаем строковое значение ID
    },

    async _generateHash(password: string, salt: string){
        return await bcrypt.hash(password, salt);
    },

    async findByIdOrFail(id: string): Promise<WithId<User>> {
      return await usersRepository.findByIdOrFail(id);
    },

    async delete(id: string): Promise<void> {
        await usersRepository.deleteUser(id);
        return;
    }
}