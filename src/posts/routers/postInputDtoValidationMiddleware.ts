import { body, param } from "express-validator";
import { blogsRepository } from "../../blogs/repositories/blogsRepository";
import { resourceTypeValidation } from "../../core/middlewares/validation/resourceTypeValidationMiddleware";
import { ResourceType } from "../../core/types/resourceType";
//import { dataIdMatchValidator } from "../../core/middlewares/validation/paramsIdValidationMiddleware";

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

export const createdAtValidator = body("createdAt")
  .optional() // Делает поле необязательным
  .isString()
  .withMessage("not string")
  .trim()
  .matches(
    /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)$/,
  )
  .withMessage("not valid date format");

export const blogIdValidator = param("blogId")
  .isString()
  .withMessage("not string")
  .trim()
  .custom(async (blogId: string) => {
    const blog = await blogsRepository.findByIdOrFail(blogId);
    if (!blog) {
      throw new Error("no blog"); // Явно сообщите об ошибке, если блог не найден
    }
    return true; // Если блог найден
  });

// export const findPostValidator = async (req: Request<{id: string}>,
//                                         res: Response, next: NextFunction) => {
//     const postId = req.params.id;
//     const post = await postsRepository.find(postId);
//     if (!post) {
//         res
//             .status(HTTP_STATUSES.NOT_FOUND_404)
//             .json({});
//         return
//     }
//
//     next()
// }

export const postCreateInputValidation = [
  //resourceTypeValidation(ResourceType.Posts),
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  //blogIdValidator,
  createdAtValidator,
];

export const postUpdateInputValidation = [
  // resourceTypeValidation(ResourceType.Posts),
  //dataIdMatchValidator,
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  //blogIdValidator,
  createdAtValidator,
];
