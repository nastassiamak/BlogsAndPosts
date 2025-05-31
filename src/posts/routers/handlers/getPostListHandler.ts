import { Request, Response } from "express";
import { PostQueryInput } from "../input/postQueryInput";
import { mapToPostListPaginatedOutput } from "../mappers/mapToPostListPaginatedOutputUtil";
//import { errorsHandler } from "../../../core/errors/errorsHandler";
import { postService } from "../../application/postService";
import { setDefaultSortAndPaginationIfNotExist } from "../../../core/helpers/setDefaultSortAndPagination";
import {ParsedQs} from "qs";
import {PostSortField} from "../input/postSortField";
import {SortDirection} from "../../../core/types/sortDirection";
import {getPostHandler} from "./getPostHandler";
import {HttpStatus} from "../../../core/types/httpStatus";
import {BlogSortField} from "../../../blogs/routers/input/blogSortField";

export async function getPostListHandler(
  req: Request<{}, {}, {}, ParsedQs>,
  res: Response,
) {
  function parsePostQuery(query: ParsedQs): PostQueryInput {
    return {
      pageNumber: Number(query.pageNumber) || 1,
      pageSize: Number(query.pageSize) || 10,
      sortBy: (query.sortBy as PostSortField) || PostSortField.CreatedAt,
      sortDirection: (query.sortDirection === "asc" ? SortDirection.Asc : SortDirection.Desc),
      searchPostTitleTerm: (query.searchPostTitleTerm as string) || undefined,
      searchPostShortDescriptionTerm: (query.searchPostShortDescriptionTerm as string) || undefined,
    };
  }

  try {

    const queryInput = parsePostQuery(req.query);
    const queryWithDefaults = setDefaultSortAndPaginationIfNotExist(queryInput);

    const {items, totalCount} = await postService.findMany(queryWithDefaults);

    const postsListOutput = mapToPostListPaginatedOutput(items,
        queryWithDefaults.pageNumber,
        queryWithDefaults.pageSize,
        totalCount,
    );
    res.send(postsListOutput);
  } catch (error) {
    console.error("Error in getPostListHandler:", error);
    res.status(HttpStatus.InternalServerError).send({message: "Internal Server Error"});
  }
}
