import { ResourceType } from "../../../core/types/resourceType";
import { PostAttributes } from "../../application/dtos/postAttributes";

export type PostCreateInput = {
  // data: {
  //   type: ResourceType.Posts;
  //   attributes: PostAttributes;
  // };
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName?: string;
  createdAt?: string;
};
