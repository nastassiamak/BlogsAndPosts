import {db} from "../../../db/inMemoryDb";
import { Request, Response } from "express";
import {HttpStatus} from "../../../core/types/httpStatus";
import {blogsRepository} from "../../repositories/blogsRepository";
import {mapToBlogViewModelUtil} from "../mappers/mapToBlogViewModelUtil";

export async function getBlogListHandler(req: Request, res: Response) {
   try {
       const blogs = await blogsRepository.findAll();
       const blogViewModel = blogs.map(mapToBlogViewModelUtil);

       res
           .send(blogViewModel);

   }catch (e: unknown) {
       res
           .sendStatus(HttpStatus.InternalServerError)
   }
}