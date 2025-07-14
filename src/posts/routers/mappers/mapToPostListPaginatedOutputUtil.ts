import { WithId } from "mongodb";
import { Post } from "../../domain/post";
import { PostListPaginatedOutput } from "../output/postListPaginatedOutput";
import { PostDataOutput } from "../output/postDataOutput";
import { ResourceType } from "../../../core/types/resourceType";
import { BlogDataOutput } from "../../../blogs/routers/output/blogDataOutput";

export function mapToPostListPaginatedOutput(
  page: number,
  pagesCount: number,
  pageSize: number,
  totalCount: number,
  posts: PostDataOutput[],
): PostListPaginatedOutput {
  return {
    pagesCount,
    page,
    pageSize,
    totalCount,
    items: posts.map((post) => ({
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
    })),
  };
}
