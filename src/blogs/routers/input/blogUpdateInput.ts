import { ResourceType } from "../../../core/types/resourceType";
import { BlogAttributes } from "../../application/dtos/blogAttributes";

export type BlogUpdateInput = {
  // data: {
  // type: ResourceType.Blogs;
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt?: string;
  isMembership?: boolean;
};
