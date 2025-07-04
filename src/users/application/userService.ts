import {UserAttributes} from "./dtos/userAttributes";
import {User} from "../domain/user";
import {usersRepository} from "../repositories/usersRepository";
import {WithId} from "mongodb";

export const userService = {
    async create(dto: UserAttributes): Promise<string> {
        const newUser: User = {
            login: dto.login,
            password: dto.password,
            email: dto.password,
            createdAt: new Date().toISOString(),
        }
        return await usersRepository.createUser(newUser);
    },

    async findByIdOrFail(id: string): Promise<WithId<User>> {
      return await usersRepository.findByIdOrFail(id);
    },

    async delete(id: string): Promise<void> {
        await usersRepository.deleteUser(id);
        return;
    }
}