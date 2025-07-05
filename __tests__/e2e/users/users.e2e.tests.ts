import express from "express";
import {setupApp} from "../../../src/setupApp";
import {generateAdminAuthToken} from "../../utils/generateAdminAuthToken";
import {runDB, stopDb} from "../../../src/db/mongoDb";
import {clearDb} from "../../utils/clearDb";
import bcrypt from "bcrypt";
import request from "supertest";
import {AUTH_PATH} from "../../../src/core/paths/paths";

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

    it("POST /login should return 204 for valid creds", async () => {
        // Добавим пользователя прямо в базу с известным паролем
        const password = "password123";
        const passwordHash = await bcrypt.hash(password, 10);

        // Здесь доступ к MongoDB коллекции пользователей - зависит от вашего импорта/инициализации
        await require("../../../src/db/mongoDb").userCollection.insertOne({
            login: "testuser",
            email: "testuser@example.com",
            password: passwordHash,
            createdAt: new Date().toISOString(),
        });

        const res = await request(app)
            .post(AUTH_PATH)
            .send({ loginOrEmail: "testuser", password });

        expect(res.status).toBe(204);
    });


    it("POST /login should return 401 for invalid creds", async () => {
        const res = await request(app)
            .post(AUTH_PATH)
            .send({ loginOrEmail: "nonexistent", password: "wrongpass" });

        expect(res.status).toBe(401);
    });

})