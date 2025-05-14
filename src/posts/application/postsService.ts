import {PostQueryInput} from "../routers/input/postQueryInput";
import {WithId} from "mongodb";
import {Post} from "../domain/post";
import {postsRepository} from "../repositories/postsRepository";
import {PostAttributes} from "./dtos/postInputDto";
import {blogService} from "../../blogs/application/blogService";


export const postsService = {
    async findMany(
        queryDto: PostQueryInput,
    ): Promise<{items: WithId<Post>[]; totalCount: number}>{
        return postsRepository.findMany(queryDto);
    },

    async findPostsByBlog(
        queryDto: PostQueryInput,
        blogId: string,
    ): Promise<{items: WithId<Post>[]; totalCount: number}>{
        await blogService.findByIdOrFail(blogId);
        return postsRepository.findPostsByBlog(queryDto, blogId);
    },

    async create(blogId: string, dto: PostAttributes): Promise<string>{
        const blog = await blogService.findByIdOrFail(blogId);
        const blogName = blog ? blog.name : "Неизвестный блог";

           const newPost: Post = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: blogId,
            blogName: blogName,

            createdAt: new Date().toISOString(),
        }
        return await postsRepository.createPost(blogId,newPost);
    }
}