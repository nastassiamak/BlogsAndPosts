import { ResourceType } from "../../../core/types/resourceType";
import { PostAttributes } from "../../application/dtos/postAttributes";

export type PostCreateInput = {
  data: {
    type: ResourceType.Posts;
    attributes: PostAttributes;
  };
};
