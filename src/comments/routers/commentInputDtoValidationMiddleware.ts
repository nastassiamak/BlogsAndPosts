import {body} from "express-validator";

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
]