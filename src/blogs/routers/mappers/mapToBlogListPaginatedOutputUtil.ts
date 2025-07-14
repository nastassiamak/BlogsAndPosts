import { BlogListPaginatedOutput } from "../output/blogListPaginatedOutput";
import { BlogDataOutput } from "../output/blogDataOutput";

export function mapToBlogListPaginatedOutput(
  page: number,
  pagesCount: number,
  pageSize: number,
  totalCount: number,
  blogs: BlogDataOutput[],
): BlogListPaginatedOutput {
  return {
    page,
    pagesCount,
    pageSize,
    totalCount,
    items: blogs.map((blog) => ({
      id: blog.id,
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt ? blog.createdAt.toString() : "",
      isMembership: blog.isMembership,
    })),
  };
}
