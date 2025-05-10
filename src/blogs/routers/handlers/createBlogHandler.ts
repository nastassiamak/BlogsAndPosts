import { Request, Response } from 'express';
import {BlogInputDto} from "../../dto/blogInputDto";
import {Blog} from "../../types/blog";
import {db} from "../../../db/inMemoryDb";
import {HttpStatus} from "../../../core/types/httpStatus";
import {blogCollection} from "../../../db/mongoDb";
import {blogsRepository} from "../../repositories/blogsRepository";
import {mapToBlogViewModelUtil} from "../mappers/mapToBlogViewModelUtil";
import {truncate} from "node:fs";


export async function createBlogHandler(
    req: Request<{}, {}, BlogInputDto>,
    res: Response) {

    try {

        const newBlog: Blog = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const createdBlog =
            await blogsRepository.create(newBlog);

        const blogViewModel = mapToBlogViewModelUtil(createdBlog)

        res
            .status(HttpStatus.Created).send(blogViewModel);

    } catch (e: unknown) {
        res
            .sendStatus(HttpStatus.InternalServerError);
    }
}