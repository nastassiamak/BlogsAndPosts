import { Router } from "express";
import {
  paginationAndSortingValidation, setPaginationDefaults,
} from "../../core/middlewares/validation/queryPaginationSortingValidation";
import { PostSortField } from "./input/postSortField";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/inputValidationResultMiddleware";
import { getPostListHandler } from "./handlers/getPostListHandler";
import { idValidation } from "../../core/middlewares/validation/paramsIdValidationMiddleware";
import { getPostHandler } from "./handlers/getPostHandler";
import { superAdminGuardMiddleware } from "../../auth/middlewares/superAdminGuardMiddleware";
import {
  postCreateInputValidation,
  postUpdateInputValidation,
} from "./postInputDtoValidationMiddleware";
import { createPostHandler } from "./handlers/createPostHandler";
import { updatePostHandler } from "./handlers/updatePostHandler";
import { deletePostHandler } from "./handlers/deletePostHandler";


export const postsRouter = Router({});

postsRouter

  .get("/:id",
      idValidation,
      inputValidationResultMiddleware,
      getPostHandler)
  .post(
    "/",
    superAdminGuardMiddleware,
    postCreateInputValidation,
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

        paginationAndSortingValidation(PostSortField),
        inputValidationResultMiddleware,
        setPaginationDefaults,
        getPostListHandler,
    )
  .delete(
    "/:id",
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deletePostHandler,
  );
