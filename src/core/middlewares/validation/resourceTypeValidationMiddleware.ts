import {ResourceType} from "../../types/resourceType";
import {body} from "express-validator";

export function resourceTypeValidation(
    resourceType: ResourceType) {
    return body('data.type')
        .isString()
        .equals(resourceType)
        .withMessage(`Resource type must be ${resourceType}`)
}