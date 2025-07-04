import {UserDataOutput} from "./userDataOutput";

export type UserListPaginatedOutput = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: UserDataOutput[];
}