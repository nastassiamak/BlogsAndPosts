import { WithId } from "mongodb";
import { Blog } from "../domain/blog";
import { BlogQueryInput } from "../routers/input/blogQueryInput";
import { blogsRepository } from "../repositories/blogsRepository";
import { BlogAttributes } from "./dtos/blogAttributes";

export const blogService = {
  async findMany(
    queryDto: BlogQueryInput,
  ): Promise<{ items: WithId<Blog>[]; totalCount: number }> {
    return blogsRepository.findMany(queryDto);
  },

  async findByIdOrFail(id: string): Promise<WithId<Blog>> {
    return blogsRepository.findByIdOrFail(id);
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

  async update(id: string, dto: BlogAttributes): Promise<void> {
    await blogsRepository.update(id, dto);
    return;
  },

  async delete(id: string): Promise<void> {
    await blogsRepository.delete(id);
    return;
  },
};
