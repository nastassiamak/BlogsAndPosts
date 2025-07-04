import express from "express";
import {setupApp} from "../../../src/setupApp";
import {generateAdminAuthToken} from "../../utils/generateAdminAuthToken";
import {runDB, stopDb} from "../../../src/db/mongoDb";
import {clearDb} from "../../utils/clearDb";
import {getUserDto} from "../../utils/users/getUserDto";
import {createUser} from "../../utils/users/createdUser";

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

    it('should create a user; POST /users', async () => {
    const [user] = await Promise.all([
        createUser(app, {
            ...getUserDto(),
        })
    ]);
    const attributes= user;
    expect(attributes).toHaveProperty("login");
    expect(attributes).toHaveProperty("password");
    expect(attributes).toHaveProperty("email");

    });
})