import {ValidationErrorType} from "../../types/validationError";
import {ValidationErrorDto} from "../../types/validation ErrorDto";
import {FieldValidationError, ValidationError, validationResult} from "express-validator";
import {Request, Response, NextFunction} from "express";
import {HttpStatus} from "../../types/httpStatus";


export const createErrorMessages = (
    errors: ValidationErrorType[],
): ValidationErrorDto => {
    return { errorMessages: errors };
};

const formatErrors = (error: ValidationError): ValidationErrorType => {
    const expressError = error as unknown as FieldValidationError;

    return {
        field: expressError.path,
        message: expressError.msg,
    };
};

export const inputValidationResultMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const errors = validationResult(req)
        .formatWith(formatErrors)
        .array({ onlyFirstError: true });

    if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).json({ errorMessages: errors });
        return;
    }

    next();
};