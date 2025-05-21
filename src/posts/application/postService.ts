import {PostQueryInput} from "../routers/input/postQueryInput";
import {WithId} from "mongodb";
import {Post} from "../domain/post";
import {postsRepository} from "../repositories/postsRepository";
import {PostAttributes} from "./dtos/postAttributes";
import {blogService} from "../../blogs/application/blogService";
import {blogsRepository} from "../../blogs/repositories/blogsRepository";

export const postService = {
    async findMany(
        queryDto: PostQueryInput,
    ): Promise< {items: WithId<Post>[]; totalCount: number}> {
        return postsRepository.findMany(queryDto);
    },

    async findPostsByBlog(
        queryDto: PostQueryInput,
        blogId: string,
    ): Promise<{ items: WithId<Post>[]; totalCount: number }> {
        await blogsRepository.findByIdOrFail(blogId);

        return postsRepository.findPostsByBlog(queryDto, blogId);
    },

    async createPostByBlogId(
        newPost: Post,
        blogId: string,
    ): Promise<string> {
        await blogsRepository.findByIdOrFail(blogId);
        return  postsRepository.createPostByBlogId(newPost, blogId);
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
         return await postsRepository.createPost(newPost);
    },

    async update(id: string,dto: PostAttributes): Promise<void> {
        await postsRepository.updatePost(id, dto);
        return;
    },

    async delete(id: string): Promise<void> {
        await postsRepository.deletePost(id);
        return;
    }
}