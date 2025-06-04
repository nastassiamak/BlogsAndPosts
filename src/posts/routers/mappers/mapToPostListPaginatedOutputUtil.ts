import { WithId } from "mongodb";
import { Post } from "../../domain/post";
import { PostListPaginatedOutput } from "../output/postListPaginatedOutput";
import { PostDataOutput } from "../output/postDataOutput";
import { ResourceType } from "../../../core/types/resourceType";

export function mapToPostListPaginatedOutput(
  posts: WithId<Post>[],

  pageNumber: number,
  pageSize: number,
  totalCount: number,
): PostListPaginatedOutput {
  return {
    pagesCount: Math.ceil(totalCount / pageSize),
    page: pageNumber,
    pageSize: pageSize,
    totalCount: totalCount,

    items: posts.map(
      (post): PostDataOutput => ({
        // type: ResourceType.Posts,
        id: post._id.toString(),
        // attributes: {
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        // },
      }),
    ),
  };
}
