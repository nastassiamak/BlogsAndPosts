import {body} from "express-validator";
import {blogsRepository} from "../blogs/repositories/blogsRepository";
import {blogService} from "../blogs/application/blogService";
import {NextFunction} from "express";

export const titleValidator = body("data.attributes.title")
    .isString()
    .withMessage('not string')
    .trim()
    .isLength({min: 1, max: 30})
    .withMessage('more then 30 or 0')

export const shortDescriptionValidator = body("data.attributes.shortDescription")
    .isString()
    .withMessage('not string')
    .trim()
    .isLength({min: 1, max: 100})
    .withMessage('more then 100 or 0')

export const contentValidator = body("data.attributes.content")
    .isString()
    .withMessage('not string')
    .trim()
    .isLength({min: 1, max: 1000})
    .withMessage('more then 1000 or 0')

export const createdAtValidator = body('data.attributes.createdAt')
    .optional() // Делает поле необязательным
    .isString()
    .withMessage('not string')
    .trim()
    .matches(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)$/)
    .withMessage('not valid date format');

export const blogIdValidator = body("data.attributes.blogPost")
    .isString()
    .withMessage('ID must be a string')
    .trim()
    .isMongoId()
    .withMessage('Неверный формат ObjectId')

// export const blogIdValidator = body("blogId").isString().withMessage('not string')
//     .trim()
//     .custom(async (blogId: string) => {
//         const blog = await blogService.findByIdOrFail(blogId);
//         if (!blog) {
//             throw new Error('no blog'); // Явно сообщите об ошибке, если блог не найден
//         }
//         return true; // Если блог найден
//     });
//
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

    titleValidator,
    shortDescriptionValidator,
    contentValidator,
    blogIdValidator,
    createdAtValidator,



]