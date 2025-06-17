import {body} from "express-validator";
import {blogsRepository} from "../../blogs/repositories/blogsRepository";


export const titleValidator = body("title")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage("more then 30 or 0");

export const shortDescriptionValidator = body("shortDescription")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage("more then 100 or 0");

export const contentValidator = body("content")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage("more then 1000 or 0");

export const blogIdValidator = body("blogId")
    .exists().withMessage("blogId is required")
    .bail()
    .isMongoId().withMessage("blogId must be valid ObjectId")
    .bail()
    .custom(async (blogId) => {
      const blogExists = await blogsRepository.findByIdOrFail(blogId)
      if (!blogExists) {
        return Promise.reject("Blog with such id does not exist");
      }
    })

export const createdAtValidator = body("createdAt")
  .optional() // Делает поле необязательным
  .isString()
  .withMessage("not string")
  .trim()
  .matches(
    /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)$/,
  )
  .withMessage("not valid date format");



export const postCreateInputValidation = [
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  createdAtValidator,
    blogIdValidator

];

export const postUpdateInputValidation = [
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  createdAtValidator,

];
