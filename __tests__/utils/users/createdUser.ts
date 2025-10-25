import { UserAttributes } from "../../../src/users/application/dtos/userAttributes";
import { UserDataOutput } from "../../../src/users/routers/output/userDataOutput";
import { Express } from "express";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import { USERS_PATH } from "../../../src/core/paths/paths";
import { UserCreateInput } from "../../../src/users/routers/input/userCreateInput";
import { generateAdminAuthToken } from "../generateAdminAuthToken";
import request from "supertest";
import {getUserDto} from "./getUserDto";

export async function createUser(
  app: Express,
  userDto?: UserAttributes,
): Promise<UserDataOutput> {

  const testUserData: UserCreateInput = {
    ...getUserDto(),
    ...userDto
  };

  console.log("Request body", JSON.stringify(testUserData, null, 2));

  const response = await request(app)
    .post(USERS_PATH)
    .set("Authorization", generateAdminAuthToken())
    .send(testUserData)
    .expect(HttpStatus.Created);

  return response.body;
}
