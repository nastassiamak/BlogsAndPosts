import {WithId} from "mongodb";
import {Post} from "../../domain/post";
import {PostOutput} from "../output/postOutput";
import {ResourceType} from "../../../core/types/resourceType";

export function mapToPostOutput(post: WithId<Post>): PostOutput {
    return {
        data: {
            type: ResourceType.Post,
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