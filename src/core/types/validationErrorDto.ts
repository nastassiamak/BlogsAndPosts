import {HttpStatus} from "./httpStatus";

type ValidationErrorOutput = {
    status: HttpStatus;
    detail: string;
    source: { pointer: string };
    code: string | null,
};

export type ValidationErrorListOutput =
    { errors: ValidationErrorOutput[] };