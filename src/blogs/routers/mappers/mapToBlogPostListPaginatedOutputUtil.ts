import {PostDataOutput} from "../../../posts/routers/output/postDataOutput";
import {PostListPaginatedOutput} from "../../../posts/routers/output/postListPaginatedOutput";

export function mapToBlogPostListPaginatedOutput(
    page: number,
    pagesCount: number,
    pageSize: number,
    totalCount: number,
    posts: PostDataOutput[],
): PostListPaginatedOutput {

    return {
        pagesCount,
        page,
        pageSize,
        totalCount,
        items: posts.map(post => ({
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
        })),
    };
}
