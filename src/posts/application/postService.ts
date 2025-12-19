import { Post } from "../domain/post";
import { postsRepository } from "../repositories/postsRepository";
import { PostAttributes } from "./dtos/postAttributes";
import { blogsQueryRepository } from "../../blogs/repositories/blogsQueryRepository";

export const postService = {
  async create(dto: PostAttributes): Promise<string> {
    const blog = await blogsQueryRepository.findByIdOrFail(dto.blogId);
    const newPost: Post = {
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blog._id.toString(),
      blogName: blog.name,
      createdAt: new Date().toISOString(),
    };
    return await postsRepository.createPost(newPost);
  },

  async update(id: string, dto: PostAttributes): Promise<void> {
    await postsRepository.updatePost(id, dto);
    return;
  },

  async delete(id: string): Promise<void> {
    await postsRepository.deletePost(id);
    return;
  },
};
