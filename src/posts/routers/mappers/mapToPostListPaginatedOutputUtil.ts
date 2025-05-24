import { WithId } from "mongodb";
import { Post } from "../../domain/post";
import { PostListPaginatedOutput } from "../output/postListPaginatedOutput";
import { PostDataOutput } from "../output/postDataOutput";
import { ResourceType } from "../../../core/types/resourceType";

export function mapToPostListPaginatedOutput(
  posts: WithId<Post>[],
  meta: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
  },
 // blogId: string,
): PostListPaginatedOutput {
  return {
    meta: {
      page: meta.pageNumber,
      pageSize: meta.pageSize,
      pageCount: Math.ceil(meta.totalCount / meta.pageSize),
      totalCount: meta.totalCount,
    },

    data: posts.map(
      (post): PostDataOutput => ({
        type: ResourceType.Posts,
        id: post._id.toString(),
        attributes: {
          title: post.title,
          shortDescription: post.shortDescription,
          content: post.content,
          blogId: post.blogId,
          blogName: post.blogName,
          createdAt: post.createdAt,
        },
      }),
    ),
  };
}
