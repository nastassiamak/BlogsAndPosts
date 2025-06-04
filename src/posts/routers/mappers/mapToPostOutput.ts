import { WithId } from "mongodb";
import { Post } from "../../domain/post";
import { ResourceType } from "../../../core/types/resourceType";
import { PostDataOutput } from "../output/postDataOutput";

export function mapToPostOutput(post: WithId<Post>): PostDataOutput {
  return {
    // data: {
    //   type: ResourceType.Posts,
    id: post._id.toString(),
    //attributes: {
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: post.blogId,
    blogName: post.blogName,
    createdAt: post.createdAt,
    //  },
    // },
  };
}
