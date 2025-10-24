import { Router } from "express";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/inputValidationResultMiddleware";
import { getPostListHandler } from "./handlers/getPostListHandler";
import { idValidation } from "../../core/middlewares/validation/paramsIdValidationMiddleware";
import { getPostHandler } from "./handlers/getPostHandler";
import { superAdminGuardMiddleware } from "../../auth/middlewares/superAdminGuardMiddleware";
import {
  postCreateWithOutBlogIdValidation,
  postUpdateInputValidation,
} from "./postInputDtoValidationMiddleware";
import { createPostHandler } from "./handlers/createPostHandler";
import { updatePostHandler } from "./handlers/updatePostHandler";
import { deletePostHandler } from "./handlers/deletePostHandler";
import { postsPaginationValidation } from "./postsPaginationValidation";
import {
  checkCommentExists,
  checkPostExists,
  commentCreateInputValidation, commentIdParamValidator, postIdParamValidator,
} from "../../comments/routers/commentInputDtoValidationMiddleware";
import { createCommentHandler } from "../../comments/routers/handler/createCommentHandler";
import { getCommentListHandler } from "../../comments/routers/handler/getCommentListHandler";
import { commentsPaginationValidation } from "../../comments/routers/commentsPaginationValidation";
import {authMiddleware} from "../../auth/authMiddleware";

export const postsRouter = Router({});

postsRouter
  .get(
    "/",
    postsPaginationValidation,
    inputValidationResultMiddleware,
    getPostListHandler,
  )
  .get("/:id", idValidation, inputValidationResultMiddleware, getPostHandler)

    .get(
    "/:postId/comments",
    postIdParamValidator,
    checkPostExists,
    commentsPaginationValidation,
    inputValidationResultMiddleware,
    getCommentListHandler,
  )
  .post(
    "/",
    superAdminGuardMiddleware,
    postCreateWithOutBlogIdValidation,
    inputValidationResultMiddleware,
    createPostHandler,
  )
  .post(
    "/:postId/comments",
    postIdParamValidator,
    checkPostExists,
    authMiddleware,
    commentCreateInputValidation,
    inputValidationResultMiddleware,
    createCommentHandler,
  )
  .put(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    postUpdateInputValidation,
    inputValidationResultMiddleware,
    updatePostHandler,
  )
  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deletePostHandler,
  );
