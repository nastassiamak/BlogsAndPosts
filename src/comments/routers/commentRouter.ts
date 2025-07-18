import { Router } from "express";
import { idValidation } from "../../core/middlewares/validation/paramsIdValidationMiddleware";
import { commentUpdateInputValidation } from "./commentInputDtoValidationMiddleware";
import { updateCommentHandler } from "./handler/updateCommentHandler";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/inputValidationResultMiddleware";
import { deleteCommentHandler } from "./handler/deleteCommentHandler";
import { getCommentHandler } from "./handler/getCommentHandler";

export const commentRouter = Router({});

commentRouter
  .get("/:id", idValidation, inputValidationResultMiddleware, getCommentHandler)
  .put(
    "/:id",
    //token
    idValidation,
    commentUpdateInputValidation,
    inputValidationResultMiddleware,
    updateCommentHandler,
  )
  .delete(
    "/:id",
    //token
    idValidation,
    inputValidationResultMiddleware,
    deleteCommentHandler,
  );
