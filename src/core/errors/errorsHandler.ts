import {RepositoryNotFoundError} from "./repositoryNotFoundError";
import {HttpStatus} from "../types/httpStatus";
import { Response} from "express";
import {createErrorMessages} from "../middlewares/validation/inputValidationResultMiddleware";
import {DomainError} from "./domainError";

export function errorsHandler(error: unknown, res: Response): void{
    if (error instanceof RepositoryNotFoundError) {
        const httpStatus = HttpStatus.NotFound;

        res
            .status(httpStatus)
            .send(
                createErrorMessages([
                    {
                        status: httpStatus,
                        detail: error.message
                    }
                ])
            );
        return;
    }

    if (error instanceof DomainError) {
        const httpStatus = HttpStatus.UnprocessableEntity

        res
            .status(httpStatus).send(
                createErrorMessages([
                    {
                        status: httpStatus,
                        source: error.source,
                        detail: error.message,
                        code: error.code,
                    }
                ])
        )
        return;
    }

    res
        .status(HttpStatus.InternalServerError);

    return;
}