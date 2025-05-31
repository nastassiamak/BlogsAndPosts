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
import { PostSortField } from "../../posts/routers/input/postSortField";
import { getBlogPostListHandler } from "./handlers/getBlogPostListHandler";
import { createBlogPostHandler } from "./handlers/createBlogPostHandler";
import {postCreateInputValidation} from "../../posts/routers/postInputDtoValidationMiddleware";

export const blogsRouter = Router({});

//middleware на весь маршрут
//blogsRouter.use(superAdminGuardMiddleware);

blogsRouter
  .get(
    "/",
    paginationAndSortingValidation(BlogSortField),
    inputValidationResultMiddleware,
    getBlogListHandler,
  )
  .get(
      "/:id",
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
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    blogUpdateInputValidation,
    inputValidationResultMiddleware,
    updateBlogHandler,
  )
  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteBlogHandler,
  )
  .get(
    "/:id/posts",
    idValidation,
    paginationAndSortingValidation(PostSortField),
    inputValidationResultMiddleware,
    getBlogPostListHandler,
  )
  .post(
    "/:id/posts",
    superAdminGuardMiddleware,
    idValidation,
    postCreateInputValidation,
    inputValidationResultMiddleware,
    createBlogPostHandler,
  );
