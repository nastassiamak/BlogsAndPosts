import { WithId } from "mongodb";
import { Blog } from "../../domain/blog";
import { ResourceType } from "../../../core/types/resourceType";
import { BlogDataOutput } from "../output/blogDataOutput";

export function mapToBlogOutput(blog: WithId<Blog>): BlogDataOutput {
  return {
    //data: {
    //type: ResourceType.Blogs,
    id: blog._id.toString(),
    // attributes: {
    name: blog.name,
    description: blog.description,
    websiteUrl: blog.websiteUrl,
    createdAt: blog.createdAt,
    isMembership: blog.isMembership,
    // },
    // },
  };
}
