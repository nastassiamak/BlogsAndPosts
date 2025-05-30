import { Response, Request } from "express";
import { HttpStatus } from "../../../core/types/httpStatus";
import { BlogUpdateInput } from "../input/blogUpdateInput";
import { blogService } from "../../application/blogService";
import {RepositoryNotFoundError} from "../../../core/errors/repositoryNotFoundError";
//import { errorsHandler } from "../../../core/errors/errorsHandler";

export async function updateBlogHandler(
  req: Request<{ id: string }, {}, BlogUpdateInput>,
  res: Response,
) {
    try {

        const id = req.params.id;
        const bodyId = req.body.id;

        // Проверка наличия id в теле
        if (!bodyId) {
             res.status(HttpStatus.BadRequest).json({
                errorsMessages: [{ field: "id", message: "ID in body is required" }],
            });
        }

        // Проверка совпадения id из тела и из параметра
        if (bodyId !== id) {
             res.status(HttpStatus.BadRequest).json({
                errorsMessages: [{ field: "id", message: "ID in URL and body must match" }],
            });
        }

        await blogService.update(id, req.body);

        res.sendStatus(HttpStatus.NoContent);
    } catch (error) {
        if (error instanceof RepositoryNotFoundError) {
            res.status(HttpStatus.NotFound).send({ message: 'Blog not found' });
        }

        res.status(HttpStatus.InternalServerError).send("Internal Server Error");
    }

}
