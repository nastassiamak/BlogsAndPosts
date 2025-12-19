import { body, param } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { postService } from "../../posts/application/postService";
import { commentService } from "../application/commentService";
import { RepositoryNotFoundError } from "../../core/errors/repositoryNotFoundError";
import { HttpStatus } from "../../core/types/httpStatus";
import { postsQueryRepository } from "../../posts/repositories/postsQueryRepository";

// Middleware для проверки существования поста после базовой валидации параметра
export async function checkPostExists(
  req: Request<{ postId: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    await postsQueryRepository.findByIdOrFail(req.params.postId);
    next();
  } catch (err) {
    if (err instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).json({ message: "Post not found" });
    } else {
      console.error(err);
      res
        .status(HttpStatus.InternalServerError)
        .json({ message: "Server error" });
    }
  }
}

// Аналогично для комментария
export async function checkCommentExists(
  req: Request<{ commentId: string }>,
  res: Response,
  next: NextFunction,
) {
  const { commentId } = req.params;

  try {
    await commentService.findByIdOrFail(commentId);
    next();
  } catch (err) {
    if (err instanceof RepositoryNotFoundError) {
      res.status(HttpStatus.NotFound).json({ message: "Post not found" });
    } else {
      console.error(err);
      res
        .status(HttpStatus.InternalServerError)
        .json({ message: "Server error" });
    }
  }
}

export const postIdParamValidator = param("postId")
  .exists()
  .withMessage("postId is required")
  .isMongoId()
  .withMessage("postId must be a valid ObjectId");

export const commentIdParamValidator = param("commentId")
  .exists()
  .withMessage("commentId is required")
  .isMongoId()
  .withMessage("commentId must be a valid ObjectId");

export const contentValidator = body("content")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 20, max: 300 })
  .withMessage("more then 300 or 20");

export const createdAtValidator = body("createdAt")
  .optional() // Делает поле необязательным
  .isString()
  .withMessage("not string")
  .trim()
  .matches(
    /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)$/,
  )
  .withMessage("not valid date format");

export const commentCreateInputValidation = [
  contentValidator,
  createdAtValidator,
];

export const commentUpdateInputValidation = [
  contentValidator,
  createdAtValidator,
];
