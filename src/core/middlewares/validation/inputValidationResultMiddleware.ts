import {ValidationErrorType} from "../../types/validationError";
import {FieldValidationError, ValidationError, validationResult} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {HttpStatus} from "../../types/httpStatus";
import {ValidationErrorListOutput} from "../../types/validationErrorDto";


export const createErrorMessages = (
    errors: ValidationErrorType[],
): ValidationErrorListOutput => {
    return {
        errors: errors.map((error) => ({
            status: error.status,
            detail: error.detail,
            source: { pointer: error.source ?? ''},
            code: error.code ?? null,
        }))
    };
};

const formaValidationError = (error: ValidationError): ValidationErrorType => {
    const expressError = error as unknown as FieldValidationError;

    return {
        status: HttpStatus.BadRequest,
        source: expressError.path,
        detail: expressError.msg
    };
};

export const inputValidationResultMiddleware = (
    req: Request<{},{},{},{}>,
    res: Response,
    next: NextFunction,
) => {
    const errors = validationResult(req)
        .formatWith(formaValidationError)
        .array({ onlyFirstError: true });

    if (errors.length > 0) {
        res.status(HttpStatus.BadRequest).json(createErrorMessages(errors));
        return;
    }

    next();
};