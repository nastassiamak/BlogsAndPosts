import { Router, Request, Response } from "express";
import { HttpStatus } from "../../core/types/httpStatus";
import {blogCollection, postCollection, userCollection} from "../../db/mongoDb";
import {usersRepository} from "../../users/repositories/usersRepository";

export const testingRouter = Router({});

testingRouter.delete("/all-data", async (req: Request, res: Response) => {
  //truncate db
  console.log("DELETE /testing/all-data received");
  await Promise.all([
    postCollection.deleteMany({}),
    blogCollection.deleteMany({}),
      userCollection.deleteMany({}),
  ]);
  res.sendStatus(HttpStatus.NoContent);
});
