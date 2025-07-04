import {User} from "../domain/user";
import {userCollection} from "../../db/mongoDb";
import { ObjectId, WithId } from "mongodb";
import {RepositoryNotFoundError} from "../../core/errors/repositoryNotFoundError";
import {UserQueryInput} from "../routers/input/userQueryInput";
import {UserListPaginatedOutput} from "../routers/output/userListPaginatedOutput";
import {UserDataOutput} from "../routers/output/userDataOutput";
import {mapToUserOutput} from "../routers/mappers/mapToUserOutput";

export const usersRepository = {
    async findMany(queryDto: UserQueryInput): Promise<UserListPaginatedOutput> {
      console.log("usersRepository.findMany started with queryDto:", queryDto);
        const {
            pageNumber = 1,
            pageSize = 10,
            sortBy = "createdAt",
            sortDirection = "desc",
            searchLoginTerm,
            searchEmailTerm,
        } = queryDto;
        const skip = (pageNumber - 1) * pageSize;
        const filter: any = {};
        if (searchLoginTerm) {
            filter.login = { $regex: searchLoginTerm, $options: "i" };
        }
        if (searchEmailTerm) {
            filter.email = { $regex: searchEmailTerm, $options: "i" };
        }
        const direction = sortDirection === "asc" ? 1 : -1;

        const totalCount =
            await userCollection.countDocuments(filter);

        const pagesCount =
            Math.ceil(totalCount / pageSize);

        const rawItems = await
            userCollection
                .find(filter)
                .sort({ [sortBy]: direction })
                .skip(skip)
                .limit(pageSize)
                .toArray();

        // Преобразуем документы в DTO
        const items: UserDataOutput[] =
            rawItems.map(mapToUserOutput);

        return { pagesCount, page: pageNumber, pageSize, totalCount, items };
    },

    async createUser(newUser: User): Promise<string> {
        const insertResult =
            await userCollection.insertOne(newUser);
        return insertResult.insertedId.toString();
    },

    async findByLoginOrEmail(loginOrEmail: string) {
        const user =
            await userCollection
                .findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
        return user;
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