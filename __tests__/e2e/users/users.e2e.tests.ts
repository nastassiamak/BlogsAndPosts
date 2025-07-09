import request from "supertest";
import express from "express";
import { setupApp } from "../../../src/setupApp";
import { runDB, stopDb, userCollection } from "../../../src/db/mongoDb";
import {AUTH_PATH, USERS_PATH} from "../../../src/core/paths/paths";
import {generateAdminAuthToken} from "../../utils/generateAdminAuthToken";

describe("User API — регистрация и логин", () => {
    const app = express();
    setupApp(app);

    const uniquePart = Date.now().toString().slice(-4); // взять 4 последние цифры от timestamp
    const login = `user${uniquePart}`; // пример: user8534 — 8 символов, удовлетворяет требованиям

    const testUser = {
        login: login,
        email: `${login}@example.com`,
        password: 'qwerty1',
    };

    beforeAll(async () => {
        await runDB("mongodb://localhost:27017/test");
        await userCollection.deleteMany({}); // очистка базы перед тестом

        // Создаём пользователя через API
        const res = await request(app)
            .post(USERS_PATH)
            .set("Authorization", generateAdminAuthToken())
            .send(testUser);
        expect(res.status).toBe(201);

        // Сохраняем креды для последующего использования в тестах
        expect.getState().newUserCreds = {
            loginOrEmail: testUser.login,
            password: testUser.password,
        };
    });

    afterAll(async () => {
        await userCollection.deleteMany({});
        await stopDb();
    });

    test("POST /auth/login — успешный логин, статус 204", async () => {
        const userCreds = expect.getState().newUserCreds;
        expect(userCreds).not.toBeUndefined();

        const res = await request(app).post(AUTH_PATH).send(userCreds);
        expect(res.status).toBe(204);
    });

    test("POST /auth/login — неуспешный логин, статус 401", async () => {
        const res = await request(app)
            .post(AUTH_PATH)
            .send({ loginOrEmail: "wronguser", password: "wrongpass" });
        expect(res.status).toBe(401);
    });
});