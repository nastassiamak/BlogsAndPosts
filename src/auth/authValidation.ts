import {body} from "express-validator";

export const loginOrEmailValidator = body("loginOrEmailValidator")
.exists()
.withMessage("login or email field is required")
.bail()
.isString()
.withMessage("login or email field must be a string")
.bail();

export const passwordValidator = body("passwordValidator")
.exists()
.withMessage("passwordValidator failed is required")
.bail()
.isString()
.withMessage("passwordValidator must be a string")
.bail();

export const authValidator = [
    loginOrEmailValidator,
    passwordValidator,
]