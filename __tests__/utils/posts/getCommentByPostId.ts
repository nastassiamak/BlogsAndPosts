import { Express } from "express";
import { CommentDataOutput } from "../../../src/comments/routers/output/commentDataOutput";
import request from "supertest";
import { COMMENTS_PATH, POSTS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/httpStatus";

export async function getCommentByPostId(
  app: Express,
  postId: string,
): Promise<CommentDataOutput> {
  const commentResponse = await request(app)
    .get(`${COMMENTS_PATH}/${postId}${POSTS_PATH}`)
    .expect(HttpStatus.Ok);

  console.log(
    "Sending GET with body:",
    JSON.stringify(commentResponse.body, null, 2),
  );
  return commentResponse.body;
}
