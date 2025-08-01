import { Router } from "express";
import { getBlogListHandler } from "./handlers/getBlogListHandler";
import { getBlogHandler } from "./handlers/getBlogHandler";
import { createBlogHandler } from "./handlers/createBlogHandler";
import { updateBlogHandler } from "./handlers/updateBlogHandler";
import { deleteBlogHandler } from "./handlers/deleteBlogHandler";
import { idValidation } from "../../core/middlewares/validation/paramsIdValidationMiddleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/inputValidationResultMiddleware";
import { superAdminGuardMiddleware } from "../../auth/middlewares/superAdminGuardMiddleware";
import {
  blogCreateInputValidation,
  blogUpdateInputValidation,
} from "./blogInputDtoValidationMiddleware";
import {
  blogIdParamValidator,
  postCreateWithOutBlogIdValidation,
} from "../../posts/routers/postInputDtoValidationMiddleware";
import { createBlogPostHandler } from "./handlers/createBlogPostHandler";
import { getBlogPostListHandler } from "./handlers/getBlogPostListHandler";

import { blogsPaginationValidation } from "./blogsPaginationValidation";
import { postsPaginationValidation } from "../../posts/routers/postsPaginationValidation";

export const blogsRouter = Router({});

blogsRouter
  .get(
    "/",
    blogsPaginationValidation,
    inputValidationResultMiddleware,
    getBlogListHandler,
  )
  .get("/:id", idValidation, inputValidationResultMiddleware, getBlogHandler)
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
    postsPaginationValidation,
    inputValidationResultMiddleware,
    getBlogPostListHandler,
  );
