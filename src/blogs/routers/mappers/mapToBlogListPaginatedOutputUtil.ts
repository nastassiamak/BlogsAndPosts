import { BlogListPaginatedOutput } from "../output/blogListPaginatedOutput";
import {BlogDataOutput} from "../output/blogDataOutput";

export function mapToBlogListPaginatedOutput(
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    blogs: BlogDataOutput[],
): BlogListPaginatedOutput {
    return {
        pagesCount,
        page,
        pageSize,
        totalCount,
        items: blogs.map(blog => ({
            id: blog.id,
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt ? blog.createdAt.toString() : "",
            isMembership: blog.isMembership,
        })),
    };
}