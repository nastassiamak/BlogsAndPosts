import { ResourceType } from "../../../core/types/resourceType";

export type PostDataOutput = {
  type: ResourceType.Posts;
  id: string;
  attributes: {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName?: string;
    createdAt?: string;
  };
};
