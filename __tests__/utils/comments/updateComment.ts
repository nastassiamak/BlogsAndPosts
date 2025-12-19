import { Express } from "express";
import { CommentAttributes } from "../../../src/comments/application/dto/commentAttributes";
import request from "supertest";
import { COMMENTS_PATH } from "../../../src/core/paths/paths";
import { generateAdminAuthToken } from "../generateAdminAuthToken";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import { getCommentDto } from "./getCommentDto";

export async function updateComment(
  app: Express,
  id: string,
  commentDto?: CommentAttributes,
): Promise<void> {
  const testCommentData = {
    id,
    ...getCommentDto(),
    ...commentDto,
  };

  console.log(
    "Sending update request with data:",
    JSON.stringify(testCommentData, null, 2),
  );

  const updateResponse = await request(app)
    .put(`${COMMENTS_PATH}/${id}`)
    .set("Autorization", generateAdminAuthToken())
    .send(testCommentData)
    .expect(HttpStatus.NoContent);

  return updateResponse.body;
}
