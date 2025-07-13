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
    it('should return status 200 and paginated users list with default pagination', async () => {
        const response = await request(app)
            .get('/users')       // без query параметров — первая страница по умолчанию
            .set('Authorization', generateAdminAuthToken())
            .expect(200);

        const data = response.body;

        // Проверка структуры и типов
        expect(data).toHaveProperty('pagesCount');
        expect(data).toHaveProperty('page');
        expect(data).toHaveProperty('pageSize');
        expect(data).toHaveProperty('totalCount');
        expect(Array.isArray(data.items)).toBe(true);

        // Проверка значений пагинации
        expect(data.page).toBe(1);           // первая страница
        expect(data.pageSize).toBe(10);      // размер страницы по умолчанию
        //expect(data.pagesCount).toBeGreaterThanOrEqual(1);
        expect(data.totalCount).toBeGreaterThanOrEqual(0);

        // Проверка, что количество записей в массиве не превышает pageSize
        expect(data.items.length).toBeLessThanOrEqual(data.pageSize);

        // При наличии тестовых данных можно проверить отдельные свойства пользователей
        if (data.items.length > 0) {
            const user = data.items[0];
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('login');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('createdAt');
        }
    });

    it('should return correct users for page 2 when page query param is set', async () => {
        const response = await request(app)
            .get('/users?pageNumber=2&pageSize=10')
            .set('Authorization', generateAdminAuthToken())
            .expect(200);

        const data = response.body;

        expect(data.page).toBe(2);
        expect(data.pageSize).toBe(10);
        //expect(data.pagesCount).toBeGreaterThanOrEqual(2);
        expect(data.items.length).toBeLessThanOrEqual(10);
    });
});