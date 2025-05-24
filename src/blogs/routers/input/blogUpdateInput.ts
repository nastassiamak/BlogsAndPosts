import { ResourceType } from "../../../core/types/resourceType";
import { BlogAttributes } from "../../application/dtos/blogAttributes";

export type BlogUpdateInput = {
  data: {
    type: ResourceType.Blogs;
    id: string;
    attributes: BlogAttributes;
  };
};
