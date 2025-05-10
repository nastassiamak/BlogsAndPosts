import {HttpStatus} from "./httpStatus";

export type ValidationErrorType = {
    status: HttpStatus;
    detail: string;
    source?: string;
    code?: string;
};