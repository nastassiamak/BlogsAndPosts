import { User } from "../domain/user";
import { userCollection } from "../../db/mongoDb";
import { ObjectId, WithId } from "mongodb";
import { RepositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { UserQueryInput } from "../routers/input/userQueryInput";
import { UserListPaginatedOutput } from "../routers/output/userListPaginatedOutput";
import { UserDataOutput } from "../routers/output/userDataOutput";
import { mapToUserOutput } from "../routers/mappers/mapToUserOutput";

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

    if (searchLoginTerm && searchEmailTerm) {
      filter.$or = [
        { login: { $regex: searchLoginTerm, $options: "i" } },
        { email: { $regex: searchEmailTerm, $options: "i" } },
      ];
    } else if (searchLoginTerm) {
      filter.login = { $regex: searchLoginTerm, $options: "i" };
    } else if (searchEmailTerm) {
      filter.email = { $regex: searchEmailTerm, $options: "i" };
    }
    // Если ни login, ни email не заданы — filter останется пустым (выборка всех)

    const direction = sortDirection === "asc" ? 1 : -1;

    const totalCount = await userCollection.countDocuments(filter);

    const pagesCount = totalCount === 0 ? 1 : Math.ceil(totalCount / pageSize);

    const rawItems = await userCollection
      .find(filter)
      .sort({ [sortBy]: direction })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const items: UserDataOutput[] = rawItems.map(mapToUserOutput);

    return { pagesCount, page: pageNumber, pageSize, totalCount, items };
  },

  async createUser(newUser: User): Promise<string> {
    const insertResult = await userCollection.insertOne(newUser);
    console.log("Insert result:", insertResult);
    return insertResult.insertedId.toString();
  },

  async findByLoginOrEmail(loginOrEmail: string) {
    const user = await userCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
    return user;
  },

  async findByIdOrFail(id: string): Promise<WithId<User>> {
    const res = await userCollection.findOne({ _id: new ObjectId(id) });

    if (!res) {
      throw new RepositoryNotFoundError("User not exists");
    }
    return res;
  },

  async deleteUser(id: string): Promise<void> {
    const deleteResult = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });
    if (deleteResult.deletedCount < 1) {
      throw new RepositoryNotFoundError("User not exist");
    }
  },
};
