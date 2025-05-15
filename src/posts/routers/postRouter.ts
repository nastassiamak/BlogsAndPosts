import {Router} from "express";
import {paginationAndSortingValidation} from "../../core/middlewares/validation/queryPaginationSortingValidation";
import {PostSortField} from "./input/postSortField";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/inputValidationResultMiddleware";

export const postRouter = Router({});

postRouter
    .get(
        '',
        paginationAndSortingValidation(PostSortField),
        inputValidationResultMiddleware,
        );
