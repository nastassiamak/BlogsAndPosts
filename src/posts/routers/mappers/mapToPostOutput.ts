import { WithId } from "mongodb";
import { PostOutput } from "../output/postOutput";
import { Post } from "../../domain/post";
import { ResourceType } from "../../../core/types/resourceType";

export function mapToPostOutput(post: WithId<Post>): PostOutput {
  return {
    data: {
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
    },
  };
}
