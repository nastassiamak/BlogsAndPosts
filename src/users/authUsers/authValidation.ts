import {body} from "express-validator";

export const loginOrEmailValidator = body("loginOrEmail")
.exists()
.withMessage("login or email field is required")
.bail()
.isString()
.withMessage("login or email field must be a string")
.bail();

export const passwordValidator = body("password")
    .isString()
    .withMessage('password must be a string')
    .isLength({ min: 6, max: 20 })
    .trim()
    .withMessage('password length must be 6-20 chars')

export const authValidator = [
    loginOrEmailValidator,
    passwordValidator,
]