import {BlogInputDto} from "../../../src/blogs/application/dtos/blogInputDto";

export function getBlogDto(): BlogInputDto {
    return {
        name: "N11",
        description: 'D11',
        websiteUrl: "http://example.com/",
        createdAt: new Date().toISOString(),
        isMembership: false
    }
}