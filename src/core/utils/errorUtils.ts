// import { ValidationErrorType } from "../types/validationError";
//
// export const createErrorMessages = (
//   errors: ValidationErrorType[],
// ): { errorMessages: ValidationErrorType[] } => {
//   return { errorMessages: errors };
// };

import { BlogDataOutput } from "../../blogs/routers/output/blogDataOutput";
import { PostDataOutput } from "../../posts/routers/output/postDataOutput";
import {PaginatedOutput} from "../types/paginatedOutput";

export type FieldNamesType = keyof BlogDataOutput | keyof PostDataOutput | keyof PaginatedOutput;

export type OutputErrorsType = {

  errorsMessages: { message: string; field: FieldNamesType }[];
};
