import { Router } from "express";
import { getBlogListHandler } from "./handlers/getBlogListHandler";
import { getBlogHandler } from "./handlers/getBlogHandler";
import { createBlogHandler } from "./handlers/createBlogHandler";
import { updateBlogHandler } from "./handlers/updateBlogHandler";
import { deleteBlogHandler } from "./handlers/deleteBlogHandler";
import { idValidation } from "../../core/middlewares/validation/paramsIdValidationMiddleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/inputValidationResultMiddleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/superAdminGuardMiddleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/queryPaginationSortingValidation";
import { BlogSortField } from "./input/blogSortField";
import {
  blogCreateInputValidation,
  blogUpdateInputValidation,
} from "./blogInputDtoValidationMiddleware";
import {
  blogIdParamValidator,
  postCreateWithOutBlogIdValidation,
} from "../../posts/routers/postInputDtoValidationMiddleware";
import { createBlogPostHandler } from "./handlers/createBlogPostHandler";
import {getBlogPostListHandler} from "./handlers/getBlogPostListHandler";
import {PostSortField} from "../../posts/routers/input/postSortField";

export const blogsRouter = Router({});

//middleware на весь маршрут
//blogsRouter.use(superAdminGuardMiddleware);

blogsRouter
  .get("/",
    paginationAndSortingValidation(BlogSortField),
    inputValidationResultMiddleware,
    getBlogListHandler,
  )
  .get("/:blogId",
      idValidation,
      inputValidationResultMiddleware,
      getBlogHandler
  )
  .post(
    "/",
    superAdminGuardMiddleware,
    blogCreateInputValidation,
    inputValidationResultMiddleware,
    createBlogHandler,
  )
  .put(
    "/:blogId",
    superAdminGuardMiddleware,
    blogUpdateInputValidation,
    inputValidationResultMiddleware,
    updateBlogHandler,
  )
  .delete(
    "/:blogId",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteBlogHandler,
  )
  .post(
    "/:blogId/posts",
    superAdminGuardMiddleware,
    blogIdParamValidator,
    postCreateWithOutBlogIdValidation,
    inputValidationResultMiddleware,
    createBlogPostHandler,
  )
    .get(
        "/:blogId/posts",
        blogIdParamValidator,
        paginationAndSortingValidation(PostSortField),
        inputValidationResultMiddleware,
        getBlogPostListHandler,
    );
