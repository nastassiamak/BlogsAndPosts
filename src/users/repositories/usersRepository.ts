import {User} from "../domain/user";
import {userCollection} from "../../db/mongoDb";
import { ObjectId, WithId } from "mongodb";
import {RepositoryNotFoundError} from "../../core/errors/repositoryNotFoundError";

export const usersRepository = {
    async createUser(newUser: User): Promise<string> {
        const insertResult =
            await userCollection.insertOne(newUser);
        return insertResult.insertedId.toString();
    },

    async findByIdOrFail(id: string): Promise<WithId<User>> {
        const res =
            await userCollection.findOne({_id: new Object(id)});
        if (!res) {
            throw new RepositoryNotFoundError("User does not exist");
        }
        return res;
    },

    async deleteUser(id: string): Promise<void> {
        const deleteResult =
            await userCollection.deleteOne({_id: new Object(id)});
        if (deleteResult.deletedCount < 1) {
            throw new RepositoryNotFoundError("User not exist");
        }
    }

}