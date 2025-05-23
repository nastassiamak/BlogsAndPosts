import { PostAttributes } from "../../../src/posts/application/dtos/postAttributes";

export function getPostDto(blogId: string): PostAttributes {
  return {
    blogId,
    title: "title1",
    shortDescription: "shortDescription1",
    content: "content1",
    // blogName: "blogId",
    // createdAt: new Date().toISOString(),
  };
}
