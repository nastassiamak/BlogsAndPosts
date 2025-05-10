import { Router } from 'express';
import {getBlogListHandler} from "./handlers/getBlogListHandler";
import {getBlogHandler} from "./handlers/getBlogHandler";
import {createBlogHandler} from "./handlers/createBlogHandler";
import {updateBlogHandler} from "./handlers/updateBlogHandler";
import {deleteBlogHandler} from "./handlers/deleteBlogHandler";
import {idValidation} from "../../core/middlewares/validation/paramsIdValidationMiddleware";
import {inputValidationResultMiddleware} from "../../core/middlewares/validation/inputValidationResultMiddleware";
import {blogInputDtoValidation} from "../validation/blogInputDtoValidation";
import {superAdminGuardMiddleware} from "../../auth/middlewares/superAdminGuardMiddleware";



export const blogsRouter = Router({});

blogsRouter
    .get('',
        getBlogListHandler
    )
    .get('/:id',
        idValidation,
        inputValidationResultMiddleware,
        getBlogHandler
    )
    .post('/',
        superAdminGuardMiddleware,
        blogInputDtoValidation,
        inputValidationResultMiddleware,
        createBlogHandler
    )
    .put('/:id',
        superAdminGuardMiddleware,
        idValidation,
        blogInputDtoValidation,
        inputValidationResultMiddleware,
        updateBlogHandler
    )
    .delete('/:id',
        superAdminGuardMiddleware,
        idValidation,
        inputValidationResultMiddleware,
        deleteBlogHandler
    )
