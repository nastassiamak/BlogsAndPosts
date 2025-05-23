import { ResourceType } from "../../../core/types/resourceType";
import { BlogAttributes } from "../../application/dtos/blogAttributes";

export type BlogCreateInput = {
  data: {
    type: ResourceType.Blog;
    attributes: BlogAttributes;
  };
};
