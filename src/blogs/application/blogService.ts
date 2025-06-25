import { WithId } from "mongodb";
import { Blog } from "../domain/blog";
import { BlogQueryInput } from "../routers/input/blogQueryInput";
import { blogsRepository } from "../repositories/blogsRepository";
import { BlogAttributes } from "./dtos/blogAttributes";
import {BlogListPaginatedOutput} from "../routers/output/blogListPaginatedOutput";

export const blogService = {
  async findMany(queryDto: BlogQueryInput): Promise<BlogListPaginatedOutput> {
    return blogsRepository.findMany(queryDto);
  },

  async findByIdOrFail(blogId: string): Promise<WithId<Blog>> {
    return blogsRepository.findByIdOrFail(blogId);
  },

  async create(dto: BlogAttributes): Promise<string> {
    const newBlog: Blog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date().toISOString(),
      isMembership: false,
    };
    return await blogsRepository.create(newBlog);
  },

  async update(blogId: string, dto: BlogAttributes): Promise<void> {
    await blogsRepository.update(blogId, dto);
    return;
  },

  async delete(blogId: string): Promise<void> {
    await blogsRepository.delete(blogId);
    return;
  },
};
