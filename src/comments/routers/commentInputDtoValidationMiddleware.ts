import {body, param} from "express-validator";
import {NextFunction, Request, Response} from "express";
import {postService} from "../../posts/application/postService";
import {commentService} from "../application/commentService";


// Middleware для проверки существования поста после базовой валидации параметра
export async function checkPostExists(
    req: Request<{ postId: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
  const { postId } = req.params;

  try {
    const post = await postService.findByIdOrFail(postId);
    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    // // Можно положить в req, если понадобится дальше
    // req.post = post;
    next();
  } catch (err) {
    // Обработка ошибок базы или прочих
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// Аналогично для комментария
export async function checkCommentExists(
    req: Request<{ commentId: string }>,
    res: Response,
    next: NextFunction
): Promise<void> {
  const { commentId } = req.params;

  try {
    const comment = await commentService.findByIdOrFail(commentId);
    if (!comment) {
      res.status(404).json({ message: "Comment not found" });
      return;
    }

    //req.comment = comment;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// export const postIdParamValidator = param("postId")
//     .exists()
//     .withMessage("postId is required")
//     .isMongoId()
//     .withMessage("postId must be a valid ObjectId");
//
//
// export const commentIdParamValidator = param("commentId")
//     .exists()
//     .withMessage("commentId is required")
//     .isMongoId()
//     .withMessage("commentId must be a valid ObjectId");
//



export const contentValidator = body("content")
  .isString()
  .withMessage("not string")
  .trim()
  .isLength({ min: 20, max: 300 })
  .withMessage("more then 300 or 20");

export const createdAtValidator = body("createdAt")
  .optional() // Делает поле необязательным
  .isString()
  .withMessage("not string")
  .trim()
  .matches(
    /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)$/,
  )
  .withMessage("not valid date format");

export const commentCreateInputValidation = [
  contentValidator,
  createdAtValidator,
];

export const commentUpdateInputValidation = [
  contentValidator,
  createdAtValidator,
];
