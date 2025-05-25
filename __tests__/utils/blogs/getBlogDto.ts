import { BlogAttributes } from "../../../src/blogs/application/dtos/blogAttributes";

export function getBlogDto(): BlogAttributes {
  return {
    name: "N11",
    description: "D11",
    websiteUrl: "http://example.com/",
    // createdAt: new Date().toISOString(),
    // isMembership: false,
  };
}
