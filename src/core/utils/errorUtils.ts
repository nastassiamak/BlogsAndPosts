import { BlogDataOutput } from "../../blogs/routers/output/blogDataOutput";
import { PostDataOutput } from "../../posts/routers/output/postDataOutput";
import { PaginatedOutput } from "../types/paginatedOutput";
import { UserDataOutput } from "../../users/routers/output/userDataOutput";

export type FieldNamesType =
  | keyof BlogDataOutput
  | keyof PostDataOutput
  | keyof PaginatedOutput
  | keyof UserDataOutput;

export type OutputErrorsType = {
  errorsMessages: { message: string; field: FieldNamesType }[];
};
