import {PostQueryInput} from "../routers/input/postQueryInput";
import {WithId} from "mongodb";
import {Post} from "../domain/post";
import {postsRepository} from "../repositories/postsRepository";
import {PostAttributes} from "./dtos/postAttributes";
import {blogService} from "../../blogs/application/blogService";

export const postService = {
    async findMany(
        queryDto: PostQueryInput,
    ): Promise< {items: WithId<Post>[]; totalCount: number}> {
        return postsRepository.findMany(queryDto);
    },

    async findByIdOrFail(id: string): Promise<WithId<Post>> {
        return postsRepository.findByIdOrFail(id);
    },

    async create(dto: PostAttributes): Promise<string> {
        const blog = await blogService.findByIdOrFail(dto.blogId);
        const blogName = blog ? blog.name : "Неизвестный блог"; // Устанавли
        const newPost: Post = {
            title: dto.title,
            shortDescription: dto.shortDescription,
            content: dto.content,
            blogId: dto.blogId,
            blogName: blogName,
            createdAt: new Date().toISOString(),
        }
         return await postsRepository.create(newPost);
    },

    async update(id: string,dto: PostAttributes): Promise<void> {
        await postsRepository.update(id, dto);
        return;
    },

    async delete(id: string): Promise<void> {
        await postsRepository.delete(id);
        return;
    }
}