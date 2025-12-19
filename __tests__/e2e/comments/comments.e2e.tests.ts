import { setupApp } from "../../../src/setupApp";
import express from "express";
import { generateAdminAuthToken } from "../../utils/generateAdminAuthToken";
import { runDB, stopDb } from "../../../src/db/mongoDb";
import { clearDb } from "../../utils/clearDb";

describe("Comment API", () => {
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
/* тесты для PUT /comments */
  it("should update a comment", async () => {
    
  });
});
