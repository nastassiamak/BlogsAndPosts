import { WithId } from "mongodb";
import { Blog } from "../../domain/blog";
import { BlogListPaginatedOutput } from "../output/blogListPaginatedOutput";
import {BlogDataOutput} from "../output/blogDataOutput";


export function mapToBlogListPaginatedOutput(
    blogs: BlogDataOutput[],
    page: number,
    pagesCount: number,
    pageSize: number,
    totalCount: number,
): BlogListPaginatedOutput {
    return {
        page,
        pagesCount,
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