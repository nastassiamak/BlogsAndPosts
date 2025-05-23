import { ValidationErrorType } from "../types/validationError";

export const createErrorMessages = (
  errors: ValidationErrorType[],
): { errorMessages: ValidationErrorType[] } => {
  return { errorMessages: errors };
};
