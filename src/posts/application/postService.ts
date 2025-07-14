import { PostQueryInput } from "../routers/input/postQueryInput";
import { WithId } from "mongodb";
import { Post } from "../domain/post";
import { postsRepository } from "../repositories/postsRepository";
import { PostAttributes } from "./dtos/postAttributes";
import { blogService } from "../../blogs/application/blogService";
import { PostListPaginatedOutput } from "../routers/output/postListPaginatedOutput";

export const postService = {
  async findMany(queryDto: PostQueryInput): Promise<PostListPaginatedOutput> {
    return postsRepository.findMany(queryDto);
  },

  async findPostsByBlogId(
    queryDto: PostQueryInput,
    blogId: string,
  ): Promise<PostListPaginatedOutput> {
    return postsRepository.findPostsByBlog(queryDto, blogId);
  },

  async findByIdOrFail(id: string): Promise<WithId<Post>> {
    return postsRepository.findByIdOrFail(id);
  },

  async create(dto: PostAttributes): Promise<string> {
    const blog = await blogService.findByIdOrFail(dto.blogId);
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
