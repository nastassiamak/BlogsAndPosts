import request from 'supertest';
import express from 'express';
import {setupApp} from "../../../src/setupApp";
import {runDB, stopDb} from "../../../src/db/mongoDb";
import {generateAdminAuthToken} from "../../utils/generateAdminAuthToken";
import {clearDb} from "../../utils/clearDb";
import {AUTH_PATH, USERS_PATH} from "../../../src/core/paths/paths";

import {HttpStatus} from "../../../src/core/types/httpStatus";


describe("User API", () => {
    const app = express();
    setupApp(app);

    const adminToken = generateAdminAuthToken();

    beforeAll(async () => {
        try {
            await runDB("mongodb://localhost:27017/test");
            console.log("Connected to test DB");
            await clearDb(app);
            console.log("Database cleared");
        } catch (error) {
            console.error("Error in beforeAll:", error);
            throw error; // повторно выбрасываем, чтобы тест падал с ошибкой
        }
    });

    afterAll(async () => {
        await stopDb();
    });

    /* Тесты для POST /users */
    describe('POST /users', () => {

        it('should create a new user and return 201 with user data', async () => {
            const uniqueSuffix = Date.now().toString().slice(-5);

            const newUser = {
                login: `user${uniqueSuffix}`,
                password: 'Password123',
                email: `user${uniqueSuffix}@example.com`,
            };

            const response = await request(app)
                .post(USERS_PATH)
                .set('Authorization', adminToken)   // если требуется авторизация
                .send(newUser)
                .expect(HttpStatus.Created);  // 201

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('login', newUser.login);
            expect(response.body).toHaveProperty('email', newUser.email);
            expect(response.body).toHaveProperty('createdAt');
        });

        it('should return 400 and validation errors when input is invalid', async () => {
            const invalidUser = {
                login: 'ab',              // Короткий логин, должен быть валидатором отклонен (мин 3 символа)
                password: '',             // Пустой пароль
                email: 'not-an-email',    // Некорректный email
            };

            const response = await request(app)
                .post(USERS_PATH)
                .set('Authorization', adminToken)
                .send(invalidUser)
                .expect(HttpStatus.BadRequest); // 400

            expect(response.body).toHaveProperty('errorsMessages');
            expect(Array.isArray(response.body.errorsMessages)).toBe(true);

            const fields = response.body.errorsMessages.map((e: any) => e.field).sort();
            expect(fields).toEqual(['email', 'login', 'password'].sort());
        });

        it('should return 401 Unauthorized if no auth provided', async () => {
            const newUser = {
                login: 'user123',
                password: 'Password123',
                email: 'user123@example.com',
            };

            await request(app)
                .post(USERS_PATH)
                .send(newUser)
                .expect(HttpStatus.Unauthorized); // 401
        });
    });

    /* Тесты для GET /users */
    describe('GET /users', () => {

        it('should return paginated users list with default parameters', async () => {
            const res = await request(app)
                .get(USERS_PATH)
                .set('Authorization', adminToken)
                .expect(HttpStatus.Ok);

            expect(res.body).toHaveProperty('pagesCount');
            expect(res.body).toHaveProperty('page', 1);
            expect(res.body).toHaveProperty('pageSize', 10);
            expect(res.body).toHaveProperty('totalCount');
            expect(Array.isArray(res.body.items)).toBe(true);
            expect(res.body.items.length).toBeLessThanOrEqual(10);

            if (res.body.items.length > 0) {
                const user = res.body.items[0];
                expect(user).toMatchObject({
                    id: expect.any(String),
                    login: expect.any(String),
                    email: expect.any(String),
                    createdAt: expect.any(String),
                });
            }
        });

        it('should return filtered users by login and email search terms', async () => {
            // Предположим, что пользователи с логином/email существуют

            const loginTerm = 'user';
            const emailTerm = 'example.com';

            const res = await request(app)
                .get(USERS_PATH)
                .query({searchLoginTerm: loginTerm, searchEmailTerm: emailTerm})
                .set('Authorization', adminToken)
                .expect(HttpStatus.Ok);

            expect(Array.isArray(res.body.items)).toBe(true);
            for (const user of res.body.items) {
                expect(user.login.toLowerCase()).toContain(loginTerm.toLowerCase());
                expect(user.email.toLowerCase()).toContain(emailTerm.toLowerCase());
            }
        });

        it('should return correct page and pageSize', async () => {
            const res = await request(app)
                .get(USERS_PATH)
                .query({pageNumber: 2, pageSize: 5})
                .set('Authorization', adminToken)
                .expect(HttpStatus.Ok);

            expect(res.body.page).toBe(2);
            expect(res.body.pageSize).toBe(5);
            expect(Array.isArray(res.body.items)).toBe(true);
            expect(res.body.items.length).toBeLessThanOrEqual(5);
        });

        it('should return 401 Unauthorized without auth header', async () => {
            await request(app)
                .get(USERS_PATH)
                .expect(HttpStatus.Unauthorized);
        });
    });

    /* Тесты для DELETE /users/:id */
    describe('DELETE /users/:id', () => {
        let createdUserId: string;

        // Создаём пользователя перед тестами удаления
        beforeEach(async () => {
            const userDto = {
                login: `user${Date.now().toString().slice(-5)}`,
                email: `user${Date.now().toString().slice(-5)}@example.com`,
                password: 'Password123',
            };

            const res = await request(app)
                .post(USERS_PATH)
                .set('Authorization', adminToken)
                .send(userDto)
                .expect(201);

            createdUserId = res.body.id;
        });

        it('should delete user by id and return 204', async () => {
            await request(app)
                .delete(`${USERS_PATH}/${createdUserId}`)
                .set('Authorization', adminToken)
                .expect(204);

            // Проверяем, что пользователя больше нет
            const getRes = await request(app)
                .get(USERS_PATH)
                .set('Authorization', adminToken)
                .expect(200);

            expect(getRes.body.items.some((u: any) => u.id === createdUserId)).toBe(false);
        })

        it('should return 401 Unauthorized without authorization header', async () => {
            await request(app)
                .delete(`${USERS_PATH}/${createdUserId}`)
                .expect(401);
        });

        it('should return 404 Not Found for non-existing user id', async () => {
            const fakeId = '000000000000000000000000';

            await request(app)
                .delete(`${USERS_PATH}/${fakeId}`)
                .set('Authorization', adminToken)
                .expect(404);
        });
    })

    /* Тесты для POST /auth/login */
    describe('POST /auth/login', () => {
        // Для входа нужен пользователь — создадим заранее
        const testUser = {
            login: 'testuser',
            email: 'testuser@example.com',
            password: 'Password123'
        };

        beforeAll(async () => {
            // Создаем пользователя для теста логина
            await request(app)
                .post(USERS_PATH)
                .set('Authorization', adminToken)
                .send(testUser)
                .expect(201);
        });

        it('should return 204 if login and password are correct', async () => {
            await request(app)
                .post(AUTH_PATH)
                .send({
                    loginOrEmail: testUser.login,
                    password: testUser.password,
                })
                .expect(204);
        });

        it('should return 400 on invalid input', async () => {
            const invalidInputs = [
                { loginOrEmail: '', password: '' },
                { loginOrEmail: 'someuser' }, // нет пароля
                { password: 'Password123' }   // нет loginOrEmail
            ];

            for (const input of invalidInputs) {
                const res = await request(app)
                    .post(AUTH_PATH)
                    .send(input)
                    .expect(400);

                expect(Array.isArray(res.body.errorsMessages)).toBe(true);
                expect(res.body.errorsMessages.length).toBeGreaterThan(0);
            }
        });

        it('should return 401 if login or password is wrong', async () => {
            const invalidCredentials = [
                { loginOrEmail: testUser.login, password: 'WrongPass' },
                { loginOrEmail: 'wronglogin', password: testUser.password },
                { loginOrEmail: 'wronglogin', password: 'WrongPass' },
            ];

            for (const creds of invalidCredentials) {
                await request(app)
                    .post(AUTH_PATH)
                    .send(creds)
                    .expect(401);
            }
        });
    });
})