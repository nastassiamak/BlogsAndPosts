import { Request, Response } from "express";
import { ParsedQs } from "qs";
import { SortDirection } from "../../../core/types/sortDirection";
import { CommentSortField } from "../input/commentSortField";
import { setDefaultSortAndPaginationIfNotExist } from "../../../core/helpers/setDefaultSortAndPagination";
import { commentService } from "../../application/commentService";
import { mapToCommentListPaginatedOutput } from "../mappers/mapToCommentListPaginatedOutput";
import { HttpStatus } from "../../../core/types/httpStatus";
import { BusinessRuleError } from "../../../core/errors/businessRuleError";


export async function getCommentListHandler(
  req: Request<{}, {}, {}, ParsedQs>,
  res: Response,
) {

  //const postId = req.params.postId;

  // if (!postId) {
  //   res.status(400).json({
  //     errorsMessages: [{ field: "postId", message: "postId is required" }]
  //   });
  //   return;
  // }
  console.log("Вызван getCommentListHandler", req.query);
  try {

    const queryInput = {
      pageNumber: Number(req.query.pageNumber) || 1,
      pageSize: Number(req.query.pageSize) || 10,
      sortBy: (req.query.sortBy as CommentSortField) || "createdAt",
      sortDirection:
        req.query.sortDirection === "asc"
          ? SortDirection.Asc
          : SortDirection.Desc,
    };

    // При необходимости установите дефолты
    const queryWithDefaults =
        setDefaultSortAndPaginationIfNotExist(queryInput);

    const paginatedComment =
        await commentService.findMany(queryWithDefaults);

    const pagesCount = Math.ceil(
      paginatedComment.totalCount / queryWithDefaults.pageSize,
    );
    const responsePayload =
        mapToCommentListPaginatedOutput(
      pagesCount,
      queryWithDefaults.pageNumber,
      queryWithDefaults.pageSize,
      paginatedComment.totalCount,
      paginatedComment.items,
    );

    console.log("Ответ API: ", responsePayload);

    res.status(HttpStatus.Ok).send(responsePayload);
    return;
  } catch (error) {
    if (error instanceof BusinessRuleError) {
      res
        .status(HttpStatus.BadRequest)
        .json({ errorsMessages: error.errors.errorsMessages });
    }
    return;
  }
}
