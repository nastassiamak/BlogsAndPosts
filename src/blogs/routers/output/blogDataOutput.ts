import { ResourceType } from "../../../core/types/resourceType";

export type BlogDataOutput = {
  //type: ResourceType.Blogs;
  blogId: string;
  //attributes: {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt?: string;
  isMembership?: boolean;
  //};
};
