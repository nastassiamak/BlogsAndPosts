import {ResourceType} from "../../../core/types/resourceType";

export type BlogCreateInput = {
    data: {
        type: ResourceType.Blog,
    }
}