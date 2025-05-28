import { ResourceType } from "../../../core/types/resourceType";
import { BlogAttributes } from "../../application/dtos/blogAttributes";

export type BlogCreateInput = {
  // data: {
  //   type: ResourceType.Blogs;
  //   attributes: BlogAttributes;
  // };
  name: string;
  description: string;
  websiteUrl: string;
};
