import {body} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {HttpStatus} from "../../core/types/httpStatus";
import {resourceTypeValidation} from "../../core/middlewares/validation/resourceTypeValidationMiddleware";
import {ResourceType} from "../../core/types/resourceType";
import {dataIdMatchValidator} from "../../core/middlewares/validation/paramsIdValidationMiddleware";


export const nameValidator = body('data.attributes.name')
    .isString().withMessage('not string')
    .trim().isLength({min: 2, max: 15})
    .withMessage('more then 15 or 0');

export const descriptionValidator = body('data.attributes.description')
    .isString().withMessage('not string')
    .trim().isLength({min: 1, max: 500})
    .withMessage('more then 500 or 0');

export const websiteUrlValidator = body('data.attributes.websiteUrl')
    .isString().withMessage('not string')
    .trim().isURL().withMessage('not url')
    .isLength({min: 1, max: 100}).withMessage('more then 100 or 0');

export const createdAtValidator = body('data.attributes.createdAt')
    .optional() // Делает поле необязательным
    .isString()
    .withMessage('not string')
    .trim()
    .matches(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)$/)
    .withMessage('not valid date format');

export const isMembershipValidator = body('data.attributes.isMembership')
    .optional() // Делает поле необязательным
    .isBoolean().withMessage('must be a boolean')
    .toBoolean(); // Опционально, чтобы преобразовать входное значение в булевый тип

export const findBlogValidator = async (req: Request<{id: string}>,
                                        res: Response, next: NextFunction) => {
    const {id} = req.params;
    if (typeof id !== "string" || id.trim().length === 0) {
        res.sendStatus(HttpStatus.BadRequest);
    }
    next()
}

export const blogCreateInputValidation = [
    resourceTypeValidation(ResourceType.Blog),
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
    createdAtValidator,
    isMembershipValidator,
    //findBlogValidator,
];

export const blogUpdateInputValidation = [
    resourceTypeValidation(ResourceType.Blog),
    dataIdMatchValidator,
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
    createdAtValidator,
    isMembershipValidator,
    //findBlogValidator,
];





// const urlPattern = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
//
//
// export const blogInputDtoValidation = (data: BlogInputDto): ValidationErrorType[] => {
//     const errors: ValidationErrorType[] = [];
//
//     if (
//         !data.name ||
//         typeof data.name !== "string" ||
//         data.name.trim().length < 2 ||
//         data.name.trim().length > 15
//     ) {
//         errors.push({field: 'name', message: 'Invalid name'});
//     }
//
//     if(
//         !data.description ||
//         typeof data.description !== "string" ||
//         data.description.trim().length < 2 ||
//         data.description.trim().length > 500
//     ){
//         errors.push({field: 'description', message: 'Invalid description'});
//     }
//
//     if (
//         !data.websiteUrl ||
//         typeof data.websiteUrl !== "string" ||
//         data.websiteUrl.trim().length < 2 ||
//         data.websiteUrl.trim().length > 100 ||
//         !urlPattern.test(data.websiteUrl.trim())
//     )
//     {
//         errors.push({field: 'websiteUrl', message: 'Invalid websiteUrl'});
//     }
//
//     return errors;
// }