import { ResourceType } from "../../../core/types/resourceType";
import { PostAttributes } from "../../application/dtos/postAttributes";

export type PostUpdateInput = {
  data: {
    type: ResourceType.Posts;
    id: string;
    attributes: PostAttributes;
  };
};
