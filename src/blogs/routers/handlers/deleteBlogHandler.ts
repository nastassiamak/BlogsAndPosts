import { Request, Response } from "express";
import { HttpStatus } from "../../../core/types/httpStatus";
import { blogService } from "../../application/blogService";
import { errorsHandler } from "../../../core/errors/errorsHandler";

export async function deleteBlogHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;

    await blogService.delete(id);
    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
