import request from 'supertest';
import express from 'express';
import {setupApp} from "../../../src/setupApp";
import {runDB, stopDb, userCollection} from "../../../src/db/mongoDb";
import {generateAdminAuthToken} from "../../utils/generateAdminAuthToken";
import {USERS_PATH} from "../../../src/core/paths/paths";

describe('Users API - создание пользователя и проверка totalCount', () => {
    const app = express();
    setupApp(app);

    beforeAll(async () => {
        await runDB('mongodb://localhost:27017/test');
    });

    beforeEach(async () => {
        await userCollection.deleteMany({});
    });

    afterAll(async () => {
        await userCollection.deleteMany({});
        await stopDb();
    });

    test('POST /users увеличивает totalCount на 1', async () => {
        // Получаем текущее количество пользователей
        const beforeRes = await request(app)
            .get(USERS_PATH)
            .set('Authorization', generateAdminAuthToken());

        expect(beforeRes.status).toBe(200);
        const totalCountBefore = beforeRes.body.totalCount;

        // Создаем уникального пользователя
        const uniqueSuffix = Date.now().toString().slice(-4);
        const newUser = {
            login: `user${uniqueSuffix}`,
            email: `user${uniqueSuffix}@example.com`,
            password: 'Password123',
        };

        const createRes = await request(app)
            .post(USERS_PATH)
            .set('Authorization', generateAdminAuthToken())
            .send(newUser);

        expect(createRes.status).toBe(201);
        expect(createRes.body.login).toBe(newUser.login);

        // Получаем новое количество пользователей
        const afterRes = await request(app)
            .get(USERS_PATH)
            .set('Authorization', generateAdminAuthToken());

        expect(afterRes.status).toBe(200);
        const totalCountAfter = afterRes.body.totalCount;

        // Проверяем, что totalCount увеличился на 1
        expect(totalCountAfter).toBe(totalCountBefore + 1);
    });
});