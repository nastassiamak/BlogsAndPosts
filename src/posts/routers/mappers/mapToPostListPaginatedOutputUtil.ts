import { WithId } from "mongodb";
import { Post } from "../../domain/post";
import { PostListPaginatedOutput } from "../output/postListPaginatedOutput";
import { PostDataOutput } from "../output/postDataOutput";
import { ResourceType } from "../../../core/types/resourceType";

export function mapToPostListPaginatedOutput(
    posts: WithId<Post>[],
    page: number,
    pageSize: number,
    totalCount: number,
): PostListPaginatedOutput {
    const pagesCount = Math.ceil(totalCount / pageSize);
    return {
        pagesCount,
        page,
        pageSize,
        totalCount,
        items: posts.map(post => ({
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        })),
    };
}
