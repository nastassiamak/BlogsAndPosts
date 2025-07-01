import {body} from "express-validator";

export const loginValidator = body("login")
    .isString()
    .withMessage('login must be a string')
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('login length must be 3-10 chars');

export const passwordValidator = body("password")
.isString()
