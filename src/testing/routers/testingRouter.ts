import {Router, Request, Response} from "express";
import {HttpStatus} from "../../core/types/httpStatus";
import {blogCollection, postCollection} from "../../db/mongoDb";

export const testingRouter = Router({});

testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    //truncate db
    await Promise.all([
        postCollection.deleteMany(),
        blogCollection.deleteMany(),
    ]);
    res.sendStatus(HttpStatus.NoContent)
})