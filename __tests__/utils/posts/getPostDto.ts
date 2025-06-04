import { PostAttributes } from "../../../src/posts/application/dtos/postAttributes";

export function getPostDto(blogId: string) {
  return {
    title: "title1",
    shortDescription: "shortDescription1",
    content: "content1",
    blogId: blogId,
    // blogName: "blogId",
    // createdAt: new Date().toISOString(),
  };
}
