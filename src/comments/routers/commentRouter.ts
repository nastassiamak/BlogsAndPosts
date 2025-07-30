import { Router } from "express";
import { idValidation } from "../../core/middlewares/validation/paramsIdValidationMiddleware";
import {commentIdParamValidator, commentUpdateInputValidation} from "./commentInputDtoValidationMiddleware";
import { updateCommentHandler } from "./handler/updateCommentHandler";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/inputValidationResultMiddleware";
import { deleteCommentHandler } from "./handler/deleteCommentHandler";
import { getCommentHandler } from "./handler/getCommentHandler";
import {authMiddleware} from "../../auth/authMiddleware";

export const commentRouter = Router({});

commentRouter
  .get("/:id", idValidation, inputValidationResultMiddleware, getCommentHandler)
  .put(
    "/:id",
    authMiddleware,
      idValidation,
    commentUpdateInputValidation,
    inputValidationResultMiddleware,
    updateCommentHandler,
  )
  .delete(
    "/:id",
    authMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteCommentHandler,
  );
