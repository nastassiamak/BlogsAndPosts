import {BlogInputDto} from "../../../src/blogs/dto/blogInputDto";

export function getBlogDto(): BlogInputDto {
    return {
        name: "N1",
        description: 'D1',
        websiteUrl: "W1",
        createdAt: new Date().toISOString(),
        isMembership: false,
    }
}