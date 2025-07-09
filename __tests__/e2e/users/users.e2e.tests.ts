// import request from "supertest";
// import express from "express";
// import { setupApp } from "../../../src/setupApp";
// import { runDB, stopDb, userCollection } from "../../../src/db/mongoDb";
// import { AUTH_PATH, USERS_PATH } from "../../../src/core/paths/paths";
// import { generateAdminAuthToken } from "../../utils/generateAdminAuthToken";
//
// describe("User API — регистрация и логин с expect.getState()", () => {
//     const app = express();
//     setupApp(app);
//
//     const uniquePart = Date.now().toString().slice(-4);
//     const login = `user${uniquePart}`;
//     const testUser = {
//         login,
//         email: `${login}@example.com`,
//         password: 'qwerty1',
//     };
//
//     beforeAll(async () => {
//         await runDB("mongodb://localhost:27017/test");
//         await userCollection.deleteMany({});
//
//         // Создаём пользователя через API
//         const res = await request(app)
//             .post(USERS_PATH)
//             .set("Authorization", generateAdminAuthToken())
//             .send(testUser);
//
//         expect(res.status).toBe(201);
//
//         // Сохраняем креды в состоянии jest
//         expect.getState().newUserCreds = {
//             loginOrEmail: testUser.login,
//             password: testUser.password,
//         };
//
//         // Сохраняем ID пользователя для удаления
//         expect.getState().newUserId = res.body.id;
//     });
//
//     afterAll(async () => {
//         await userCollection.deleteMany({});
//         await stopDb();
//     });
//
//     test("POST /auth/login — успешный логин, статус 204", async () => {
//         const userCreds = expect.getState().newUserCreds;
//         expect(userCreds).not.toBeUndefined();
//
//         const res = await request(app)
//             .post(AUTH_PATH)
//             .send(userCreds);
//
//         expect(res.status).toBe(204);
//     });
//
//     test("POST /auth/login — неуспешный логин, статус 401", async () => {
//         const res = await request(app)
//             .post(AUTH_PATH)
//             .send({ loginOrEmail: "wronguser", password: "wrongpass" });
//
//         expect(res.status).toBe(401);
//     });
//
//     test("DELETE /users/:id — удаление пользователя", async () => {
//         const userId = expect.getState().newUserId;
//         const res = await request(app)
//             .delete(`${USERS_PATH}/${userId}`)
//             .set("Authorization", generateAdminAuthToken());
//
//         expect(res.status).toBe(204);
//
//         // Проверим, что пользователя больше нет в списке
//         const listRes = await request(app)
//             .get(USERS_PATH)
//             .set("Authorization", generateAdminAuthToken());
//
//         expect(listRes.status).toBe(200);
//         expect(listRes.body.items.find((u: any) => u.id === userId)).toBeUndefined();
//     });
// });