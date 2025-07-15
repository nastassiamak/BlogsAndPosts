import {Request,Response} from "express";
import {CommentCreateInput} from "../input/commentCreateInput";
import {postService} from "../../../posts/application/postService";

export async function createCommentHandler(
    req: Request<{postId: string},{}, CommentCreateInput>,
    res: Response,
    ) {
    try {
        const postId = await postService.findByIdOrFail(req.params.postId);
        if (!postId) {

        }
    }
}