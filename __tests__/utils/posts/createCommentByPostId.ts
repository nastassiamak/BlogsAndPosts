import { Express } from "express";
import { CommentAttributes } from "../../../src/comments/application/dto/commentAttributes";
import { CommentCreateInput } from "../../../src/comments/routers/input/commentCreateInput";
import { CommentDataOutput } from "../../../src/comments/routers/output/commentDataOutput";
import { getCommentDto } from "../comments/getCommentDto";
import { COMMENTS_PATH, POSTS_PATH } from "../../../src/core/paths/paths";
import request from "supertest";
import { generateAdminAuthToken } from "../generateAdminAuthToken";
import { HttpStatus } from "../../../src/core/types/httpStatus";

export async function createCommentByPostId(
  app: Express,
  postId: string,
  commentDto?: Partial<CommentCreateInput>,
): Promise<CommentAttributes> {
  const commentDataToSend = {
    postId: postId,
    ...getCommentDto(),
    ...commentDto,
  };

  console.log(
    "Sending POST with body:",
    JSON.stringify(commentDataToSend, null, 2),
  );

  const response = await request(app)
    .post(`${COMMENTS_PATH}/${postId}${POSTS_PATH}`)
    .set("Authorization", generateAdminAuthToken())
    .send(commentDataToSend)
    .expect(HttpStatus.Created);

  return response.body;
}
