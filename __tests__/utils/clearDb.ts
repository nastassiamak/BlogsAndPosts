// @ts-ignore

import { TESTING_PATH } from "../../src/core/paths/paths";
import { HttpStatus } from "../../src/core/types/httpStatus";
import request from "supertest";
import { Express } from "express";

export async function clearDb(app: Express) {
  await request(app)
    .delete(`${TESTING_PATH}/all-data`)
    .set("Content-Type", "application/json")
    .expect(HttpStatus.NoContent);
}
