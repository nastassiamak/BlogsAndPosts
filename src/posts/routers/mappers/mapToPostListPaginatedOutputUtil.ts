import {WithId} from "mongodb";
import {Post} from "../../domain/post";
import {PostListPaginationOutput} from "../output/postListPaginationOutput";
import {ResourceType} from "../../../core/types/resourceType";

export function mapToPostListPaginatedOutputUtil(
    posts: WithId<Post>[],
    meta: {pageNumber: number, pageSize: number; totalCount: number},
): PostListPaginationOutput {
    return {
        meta: {
            page: meta.pageNumber,
            pageSize: meta.pageSize,
            pageCount: Math.ceil(meta.totalCount / meta.pageSize),
            totalCount: meta.totalCount,
        },
        data: posts.map((post) => ({
            type: ResourceType.Post,
            id: post._id.toString(),
            attributes: {
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
            }
        }))
    }
}
