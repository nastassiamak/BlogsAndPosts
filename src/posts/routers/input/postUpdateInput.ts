import { ResourceType } from "../../../core/types/resourceType";
import { PostAttributes } from "../../application/dtos/postAttributes";

export type PostUpdateInput = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string;
  createdAt?: string;
};
