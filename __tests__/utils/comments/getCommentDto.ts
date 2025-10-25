import {CommentAttributes} from "../../../src/comments/application/dto/commentAttributes";
import {CommentCreateInput} from "../../../src/comments/routers/input/commentCreateInput";
import {Comments} from "../../../src/comments/domain/comment";

export function getCommentDto(): CommentCreateInput {
    return {
        content: "test content",
    }
}