import {Request, Response} from "express";
import {BlogQueryInput} from "../input/blogQueryInput";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/setDefaultSortAndPagination";
import {blogService} from "../../application/blogService";
import {mapToBlogListPaginatedOutput} from "../mappers/mapToBlogListPaginatedOutputUtil";
import {ParsedQs} from "qs";
import {BlogSortField} from "../input/blogSortField";
import {SortDirection} from "../../../core/types/sortDirection";
import {RepositoryNotFoundError} from "../../../core/errors/repositoryNotFoundError";
import {HttpStatus} from "../../../core/types/httpStatus";
import {mapToBlogOutput} from "../mappers/mapToBlogOutput";

//import { errorsHandler } from "../../../core/errors/errorsHandler";

export async function getBlogListHandler(
  req: Request<{}, {}, {}, ParsedQs>,
  res: Response,
) {
    function parseBlogQuery(query: ParsedQs): BlogQueryInput {
        return {
            pageNumber: Number(query.pageNumber) || 1,
            pageSize: Number(query.pageSize) || 10,
            sortBy: (query.sortBy as BlogSortField) || BlogSortField.CreatedAt,
            sortDirection: (query.sortDirection === "asc" ? SortDirection.Asc : SortDirection.Desc),
            searchBlogNameTerm: (query.searchNameTerm as string) || undefined,
            searchBlogDescriptionTerm: (query.searchBlogDescriptionTerm as string) || undefined,
        };
    }

    try {
        const queryInput = parseBlogQuery(req.query);
        const queryWithDefaults = setDefaultSortAndPaginationIfNotExist(queryInput);

        const paginatedBlogs = await blogService.findMany(queryWithDefaults);
        console.log(`Найдено постов: ${paginatedBlogs.items.length}, всего: ${paginatedBlogs.totalCount}`);

        // Маппим каждый пост из БД в нужный формат output
        const mappedItems = paginatedBlogs.items.map(blog => mapToBlogOutput(blog));


        // Формируем итоговый ответ с пагинацией и преобразованными постами
        const responsePayload = {
            pagesCount: Math.ceil(paginatedBlogs.totalCount / queryWithDefaults.pageSize),
            page: queryWithDefaults.pageNumber,
            pageSize: queryWithDefaults.pageSize,
            totalCount: paginatedBlogs.totalCount,
            items: mappedItems,
        };
        res.send(responsePayload);
    } catch (error) {
        if (error instanceof RepositoryNotFoundError) {
            res.status(HttpStatus.NotFound).send({ message: 'Blog not found' });
        }
        res.status(400).send({ message: (error as Error).message || "Invalid query" });
    }
}


