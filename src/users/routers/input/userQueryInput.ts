import {PaginationAndSorting} from "../../../core/types/paginationAndSorting";
import {UserSortField} from "./userSortField";

export type UserQueryInput = PaginationAndSorting<UserSortField>
    &
    Partial<{
        searchLoginTerm: string;
        searchEmailTerm: string;
    }>;