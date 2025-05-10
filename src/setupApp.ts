import express, {Express} from 'express';
import {BLOGS_PATH, TESTING_PATH} from "./core/paths/paths";
import {blogsRouter} from "./blogs/routers/blogsRouter";
import {testingRouter} from "./testing/routers/testingRouter";

export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    //основной роут
    app.get('/', (req, res) => {
        res.status(200).send("Hello world!");
    });

    app.use(BLOGS_PATH, blogsRouter);
    app.use(TESTING_PATH, testingRouter);

    return app;
}