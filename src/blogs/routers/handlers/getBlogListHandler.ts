import { Request, Response } from "express";
import {BlogQueryInput} from "../input/blogQueryInput";
import {setDefaultSortAndPaginationIfNotExist} from "../../../core/helpers/setDefaultSortAndPagination";
import {blogService} from "../../application/blogService";
import {mapToBlogListPaginatedOutput} from "../mappers/mapToBlogListPaginatedOutputUtil";
import {errorsHandler} from "../../../core/errors/errorsHandler";

export async function getBlogListHandler(
    req: Request<{}, {}, {}, BlogQueryInput>,
    res: Response) {
   try {
       const queryInput =
           setDefaultSortAndPaginationIfNotExist(req.query);

       const {items, totalCount} = await blogService
           .findMany(queryInput);

       const blogsListOutput =
           mapToBlogListPaginatedOutput(
           items, {
               pageNumber: queryInput.pageNumber,
               pageSize: queryInput.pageSize,
               totalCount,
           }
       );

       res
           .send(blogsListOutput);

   }catch (e: unknown) {
       errorsHandler(e, res);
   }
}