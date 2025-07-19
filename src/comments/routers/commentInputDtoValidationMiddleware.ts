import {body, param} from "express-validator";

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
