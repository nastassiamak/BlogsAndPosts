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

    async findByIdOrFail(id: string): Promise<WithId<Post> | null> {
        return postsRepository.findByIdOrFail(id);
    },

    async create(dto: PostAttributes): Promise<string> {
        try {
            const blog = await blogsRepository.findByIdOrFail(dto.blogId);

            // Проверка на null. Здесь вы можете выбросить ошибку или выполнить другую логику.
            if (!blog) {
                throw new Error(`Blog with ID ${dto.blogId} not found.`);
            }

            const newPost: Post = {
                title: dto.title,
                shortDescription: dto.shortDescription,
                content: dto.content,
                blogId: blog._id.toString(), // Используйте правильное свойство для id
                blogName: blog.name,
                createdAt: new Date().toISOString()
            };

            return await postsRepository.createPost(newPost);
        } catch (error) {
            console.error('Error creating post:', error);
            throw new Error('Unable to create post'); // Бросаем ошибку
        } 
    }
}