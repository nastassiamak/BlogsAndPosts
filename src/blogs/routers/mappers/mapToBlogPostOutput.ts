import { WithId } from "mongodb";
import { Blog } from "../../domain/blog";
import { Post } from "../../../posts/domain/post";
import { BlogPostOutput } from "../output/blogPostOutput";

export function mapToBlogPostOutput(
  blog: WithId<Blog>,
  post: WithId<Post>,
): BlogPostOutput {
  return {
    id: post._id.toString(),
    title: post.title,
    shortDescription: post.shortDescription,
    content: post.content,
    blogId: blog._id.toString(),
    blogName: blog.name,
    createdAt: post.createdAt,
  };
}
