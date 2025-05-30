import { WithId } from "mongodb";
import { Blog } from "../../domain/blog";
import { BlogListPaginatedOutput } from "../output/blogListPaginatedOutput";
import { BlogDataOutput } from "../output/blogDataOutput";
import { ResourceType } from "../../../core/types/resourceType";

export function mapToBlogListPaginatedOutput(
  blogs: WithId<Blog>[],

    pageNumber: number,
    pageSize: number,
    totalCount: number,

): BlogListPaginatedOutput {
  return {

      pagesCount: Math.ceil(totalCount / pageSize),
      page: pageNumber,
      pageSize: pageSize,
      totalCount: totalCount,


    items: blogs.map(
      (blog): BlogDataOutput => ({
       // type: ResourceType.Blogs,
        id: blog._id.toString(),
       // attributes: {
          name: blog.name,
          description: blog.description,
          websiteUrl: blog.websiteUrl,
          createdAt: blog.createdAt,
          isMembership: blog.isMembership,
       // },
      }),
    ),
  };
}
