import { PostAttributes } from "../../../src/posts/application/dtos/postAttributes";

export function getPostDto(): Omit<PostAttributes, "blogId"> {
  return {
    title: "title1",
    shortDescription: "shortDescription1",
    content: "content1",
    // blogName: "blogId",
    // createdAt: new Date().toISOString(),
  };
}
