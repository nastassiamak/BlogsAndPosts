// import { ValidationErrorType } from "../types/validationError";
//
// export const createErrorMessages = (
//   errors: ValidationErrorType[],
// ): { errorMessages: ValidationErrorType[] } => {
//   return { errorMessages: errors };
// };

import { BlogDataOutput } from "../../blogs/routers/output/blogDataOutput";
import { PostDataOutput } from "../../posts/routers/output/postDataOutput";

export type FieldNamesType = keyof BlogDataOutput | keyof PostDataOutput;

export type OutputErrorsType = {
  errorsMessages: { message: string; field: FieldNamesType }[];
};
