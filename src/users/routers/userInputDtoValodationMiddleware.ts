import {body} from "express-validator";

export const loginValidator = body("login")
    .isString()
    .withMessage('login must be a string')
    .isLength({ min: 3, max: 10 })
    .withMessage('login length must be 3-10 chars')
    .matches(/^[a-zA-Z0-9_-]*$/)
    .withMessage('login contains invalid characters')

export const passwordValidator = body("password")
    .isString()
    .withMessage('password must be a string')
    .isLength({ min: 6, max: 20 })
    .withMessage('password length must be 6-20 chars')

export const emailValidator = body("email")
    .isString()
    .withMessage('email must be a string')
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('invalid email format')

export const createdAtValidator = body("createdAt")
    .optional() // Делает поле необязательным
    .isString()
    .withMessage("not string")
    .trim()
    .matches(
        /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)$/,
    )
    .withMessage("not valid date format");


export const userCreateInputValidation = [
    loginValidator,
    passwordValidator,
    emailValidator,
    createdAtValidator,
]