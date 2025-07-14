import { PostCreateInput } from "../../../src/posts/routers/input/postCreateInput";

export function getPostDto(blogId: string): PostCreateInput {
  return {
    title: "title1",
    shortDescription: "shortDescription1",
    content: "content1",
    blogId,
  };
}
