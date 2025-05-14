import {ResourceType} from "../../../core/types/resourceType";
import {PostAttributes} from "../../application/dtos/postInputDto";

export type PostCreateInput = {
    data: {
        type: ResourceType.Post,
        attributes: PostAttributes,
    }
}