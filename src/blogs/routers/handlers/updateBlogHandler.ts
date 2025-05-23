import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/httpStatus";
import { BlogUpdateInput } from "../input/blogUpdateInput";
import { blogService } from "../../application/blogService";
import { errorsHandler } from "../../../core/errors/errorsHandler";

export async function updateBlogHandler(
  req: Request<{ id: string }, {}, BlogUpdateInput>,
  res: Response,
) {
  try {
    const id = req.params.id;

    await blogService.update(id, req.body.data.attributes);

    res.sendStatus(HttpStatus.NoContent);
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
