import { PaginationAndSorting } from "../types/paginationAndSorting";
import { paginationAndSortingDefault } from "../middlewares/validation/queryPaginationSortingValidation";

export function setDefaultSortAndPaginationIfNotExist<P = string>(
  query: Partial<PaginationAndSorting<P>>,
): PaginationAndSorting<P> {
  return {
    ...paginationAndSortingDefault,
    ...query,
    sortBy: (query.sortBy ?? paginationAndSortingDefault.sortBy) as P,
  };
}
