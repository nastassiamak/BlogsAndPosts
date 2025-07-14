import { UserAttributes } from "../../../src/users/application/dtos/userAttributes";
import { UserDataOutput } from "../../../src/users/routers/output/userDataOutput";
import { Express } from "express";
import { HttpStatus } from "../../../src/core/types/httpStatus";
import { USERS_PATH } from "../../../src/core/paths/paths";
import { UserCreateInput } from "../../../src/users/routers/input/userCreateInput";
import { generateAdminAuthToken } from "../generateAdminAuthToken";
import request from "supertest";

export async function createUser(
  app: Express,
  userDto: Partial<UserAttributes> = {},
): Promise<UserDataOutput> {
  const uniqueSuffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;

  // Ограничиваем login 10 символами (например)
  const loginSuffix = uniqueSuffix.slice(-6); // взять последние 6 символов для уникальности

  const baseUserData: UserCreateInput = {
    login: `user${loginSuffix}`, // 'user' + 6 символов = 10 символов максимум
    email: `user${uniqueSuffix}@example.com`, // email обычно может быть длиннее
    password: "oksfs2342QWE",
  };

  const testUserData: UserCreateInput = {
    ...userDto,
    login: baseUserData.login,
    email: baseUserData.email,
    password: userDto.password || baseUserData.password,
  };

  console.log("Request body", JSON.stringify(testUserData, null, 2));

  const response = await request(app)
    .post(USERS_PATH)
    .set("Authorization", generateAdminAuthToken())
    .send(testUserData)
    .expect(HttpStatus.Created);

  return response.body;
}
