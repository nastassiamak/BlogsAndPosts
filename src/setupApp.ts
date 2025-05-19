import express, {Express} from 'express';
import {BLOGS_PATH, POSTS_PATH, TESTING_PATH} from "./core/paths/paths";
import {blogsRouter} from "./blogs/routers/blogsRouter";
import {testingRouter} from "./testing/routers/testingRouter";
import {postRouter} from "./posts/routers/postRouter";
import {setupSwagger} from "./core/swagger/setupSwagger";

/**
 * Настраиваем routes, cors, swagger
 * @param app
 */

export const setupApp = (app: Express) => {
    app.use(express.json()); // middleware для парсинга JSON в теле запроса

    app.use(BLOGS_PATH, blogsRouter);
    app.use(POSTS_PATH, postRouter);
    app.use(TESTING_PATH, testingRouter);

    setupSwagger(app)

    return app;
}