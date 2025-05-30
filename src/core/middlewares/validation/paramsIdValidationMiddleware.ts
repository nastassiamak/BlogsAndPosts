import { body, param } from "express-validator";

export const idValidation = param("id")
  .exists()
  .withMessage("ID is required")
    .bail()
  .isString()
  .withMessage("ID must be a string")
  .isMongoId()
  .withMessage("Incorrect format of ObjectId");

export const dataIdMatchValidator = body("id")
  .exists()
  .withMessage("ID in body is required")
    .bail()
  .custom((value, { req }) => {
    if (value !== req?.params?.id) {
      throw new Error("ID in URL and body must match");
    }
    return true;
  });
