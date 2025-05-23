import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errorsHandler";
import { postService } from "../../application/postService";
import { HttpStatus } from "../../../core/types/httpStatus";

export async function deletePostHandler(
  req: Request<{ id: string }>,
  res: Response,
) {
  try {
    const id = req.params.id;
    await postService.delete(id);

    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
