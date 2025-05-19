import {WithId} from "mongodb";
import {Blog} from "../../domain/blog";
import {ResourceType} from "../../../core/types/resourceType";
import {BlogOutput} from "../output/blogOutput";

export function mapToBlogOutput(blog: WithId<Blog>): BlogOutput {
    return {
        data: {
            type: ResourceType.Blog,
            id: blog._id.toString(),
            attributes: {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership,
        }
    }
}
}
