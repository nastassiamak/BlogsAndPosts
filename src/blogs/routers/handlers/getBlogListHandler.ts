import {Request, Response} from "express";
import {BlogQueryInput} from "../input/blogQueryInput";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/setDefaultSortAndPagination";
import {blogService} from "../../application/blogService";
import {mapToBlogListPaginatedOutput} from "../mappers/mapToBlogListPaginatedOutputUtil";
import {ParsedQs} from "qs";
import {BlogSortField} from "../input/blogSortField";
import {SortDirection} from "../../../core/types/sortDirection";

//import { errorsHandler } from "../../../core/errors/errorsHandler";

export async function getBlogListHandler(
  req: Request<{}, {}, {}, ParsedQs>,
  res: Response,
) {
    function parseBlogQuery(query: ParsedQs): BlogQueryInput {
        return {
            pageNumber: Number(query.pageNumber) || 1,
            pageSize: Number(query.pageSize) || 10,
            sortBy: BlogSortField.CreatedAt,
            sortDirection: SortDirection.Desc
        };
    }

    try {
        const queryInput = parseBlogQuery(req.query);
        const queryWithDefaults = setDefaultSortAndPaginationIfNotExist(queryInput);

        const { items, totalCount } = await blogService.findMany(queryWithDefaults);

        const blogsListOutput = mapToBlogListPaginatedOutput(items,
            queryWithDefaults.pageNumber,
            queryWithDefaults.pageSize,
            totalCount,
        );

        res.send(blogsListOutput);
    } catch (error) {
        res.status(400).send({ message: (error as Error).message || "Invalid query" });
    }
}


