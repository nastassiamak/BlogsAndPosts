import { WithId } from "mongodb";
import { Blog } from "../../domain/blog";
import { BlogListPaginatedOutput } from "../output/blogListPaginatedOutput";
import { BlogDataOutput } from "../output/blogDataOutput";
import { ResourceType } from "../../../core/types/resourceType";

export function mapToBlogListPaginatedOutput(
  blogs: WithId<Blog>[],
  meta: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
  },
): BlogListPaginatedOutput {
  return {
    meta: {
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      pageCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
    },

    data: blogs.map(
      (blog): BlogDataOutput => ({
        type: ResourceType.Blog,
        id: blog._id.toString(),
        attributes: {
          name: blog.name,
          description: blog.description,
          websiteUrl: blog.websiteUrl,
          createdAt: blog.createdAt,
          isMembership: blog.isMembership,
        },
      }),
    ),
  };
}
