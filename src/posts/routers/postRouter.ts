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

export const postsRouter = Router({});

postsRouter

  .get("/:id", idValidation, inputValidationResultMiddleware, getPostHandler)
  .post(
    "/",
    superAdminGuardMiddleware,
    postCreateWithOutBlogIdValidation,
    inputValidationResultMiddleware,
    createPostHandler,
  )
  .put(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    postUpdateInputValidation,
    inputValidationResultMiddleware,
    updatePostHandler,
  )
  .get(
    "/",
    postsPaginationValidation,
    inputValidationResultMiddleware,
    getPostListHandler,
  )
  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deletePostHandler,
  );
