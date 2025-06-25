import {body, param} from "express-validator";

export const blogIdValidation = param("blogId")
    .exists()
    .withMessage("ID is required")
    .bail()
    .isString()
    .withMessage("ID must be a string")
    .isMongoId()
    .withMessage("Incorrect format of ObjectId");

export const nameValidator = body("name")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 2, max: 15 })
  .withMessage("more then 15 or 0");

export const descriptionValidator = body("description")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage("more then 500 or 0");

export const websiteUrlValidator = body("websiteUrl")
  .isString()
  .withMessage("not string")
  .trim()
  .isURL()
  .withMessage("not url")
  .isLength({ min: 1, max: 100 })
  .withMessage("more then 100 or 0");

export const createdAtValidator = body("createdAt")
  .optional() // Делает поле необязательным
  .isString()
  .withMessage("not string")
  .trim()
  .matches(
    /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)$/,
  )
  .withMessage("not valid date format");

export const isMembershipValidator = body("isMembership")
  .optional() // Делает поле необязательным
  .isBoolean()
  .withMessage("must be a boolean")
  .toBoolean(); // Опционально, чтобы преобразовать входное значение в булевый тип

export const blogCreateInputValidation = [
  nameValidator,
  descriptionValidator,
  websiteUrlValidator,
  createdAtValidator,
  isMembershipValidator,
];

export const blogUpdateInputValidation = [
    blogIdValidation,
  nameValidator,
  descriptionValidator,
  websiteUrlValidator,
  createdAtValidator,
  isMembershipValidator,
];
