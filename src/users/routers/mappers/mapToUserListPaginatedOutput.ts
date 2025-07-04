import {UserDataOutput} from "../output/userDataOutput";
import {UserListPaginatedOutput} from "../output/userListPaginatedOutput";
import {usersRepository} from "../../repositories/usersRepository";

export function mapToUserListPaginatedOutput(
    page: number,
    pagesCount: number,
    pageSize: number,
    totalCount: number,
    users: UserDataOutput[],
): UserListPaginatedOutput{
    return {
        page,
        pagesCount,
        pageSize,
        totalCount,
        items: users.map(user => ({
            id: user.id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }))
    }
}