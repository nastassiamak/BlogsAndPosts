import { query } from "express-validator";

export const blogsPaginationValidation = [
  query("searchNameTerm").optional().isString(),
  query("sortBy").optional().default("createdAt").isIn(["createdAt", "name"]),
  query("sortDirection").optional().default("desc").isIn(["asc", "desc"]),
  query("pageNumber").optional().default(1).isInt({ min: 1 }).toInt(),
  query("pageSize").optional().default(10).isInt({ min: 1 }).toInt(),
];
