import request from 'supertest';
import express from 'express';
import {setupApp} from "../../../src/setupApp";
import {runDB, stopDb, userCollection} from "../../../src/db/mongoDb";
import {generateAdminAuthToken} from "../../utils/generateAdminAuthToken";
import {USERS_PATH} from "../../../src/core/paths/paths";
describe('Users API - создание пользователя и проверка totalCount', () => {
    const app = express();
    setupApp(app);

    // Подключение к тестовой БД и инициализация приложения
    beforeAll(async () => {
        await runDB('mongodb://localhost:27017/test');
    });

    // Очистка коллекции пользователей перед каждым тестом
    beforeEach(async () => {
        await userCollection.deleteMany({});
    });

    // Очистка и остановка БД после всех тестов
    afterAll(async () => {
        await userCollection.deleteMany({});
        await stopDb();
    });

    it('POST /users должен увеличивать totalCount на 1', async () => {
        // Получаем текущее количество пользователей
        const beforeRes = await request(app)
            .get('/users')
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
            .post('/users')
            .set('Authorization', generateAdminAuthToken())
            .send(newUser);

        expect(createRes.status).toBe(201);
        expect(createRes.body.login).toBe(newUser.login);

        // Получаем новое количество пользователей
        const afterRes = await request(app)
            .get('/users')
            .set('Authorization', generateAdminAuthToken());

        expect(afterRes.status).toBe(200);
        const totalCountAfter = afterRes.body.totalCount;

        // Проверяем, что totalCount увеличился на 1
        expect(totalCountAfter).toBe(totalCountBefore + 1);
    });

    it('GET /users должен возвращать первую страницу с дефолтными параметрами', async () => {
        const res = await request(app)
            .get('/users')
            .set('Authorization', generateAdminAuthToken())
            .expect(200);

        const data = res.body;

        expect(data).toHaveProperty('pagesCount');
        expect(data).toHaveProperty('page', 1);
        expect(data).toHaveProperty('pageSize', 10);
        expect(data).toHaveProperty('totalCount');
        expect(Array.isArray(data.items)).toBe(true);
        expect(data.items.length).toBeLessThanOrEqual(10);

        if (data.items.length > 0) {
            const user = data.items[0];
            expect(user).toHaveProperty('id');
            expect(user).toHaveProperty('login');
            expect(user).toHaveProperty('email');
            expect(user).toHaveProperty('createdAt');
        }
    });

    it('GET /users с query параметрами pageNumber=2&pageSize=10 возвращает корректную страницу', async () => {
        const res = await request(app)
            .get('/users')
            .query({ pageNumber: 2, pageSize: 10 })
            .set('Authorization', generateAdminAuthToken())
            .expect(200);

        const data = res.body;

        expect(data).toHaveProperty('page', 2);
        expect(data).toHaveProperty('pageSize', 10);
        expect(data.items.length).toBeLessThanOrEqual(10);
    });

    it('GET /users с query параметрами pageNumber=2&pageSize=5 возвращает корректную страницу и размер страницы', async () => {
        const res = await request(app)
            .get('/users')
            .query({ pageNumber: 2, pageSize: 5 })
            .set('Authorization', generateAdminAuthToken())
            .expect(200);

        expect(res.body).toHaveProperty('page', 2);
        expect(res.body).toHaveProperty('pageSize', 5);
        expect(Array.isArray(res.body.items)).toBe(true);
        expect(res.body.items.length).toBeLessThanOrEqual(5);
    });
});