import express, { Express } from "express";
import { BLOGS_PATH, POSTS_PATH, TESTING_PATH } from "./core/paths/paths";
import { blogsRouter } from "./blogs/routers/blogsRouter";
import { testingRouter } from "./testing/routers/testingRouter";
import { setupSwagger } from "./core/swagger/setupSwagger";
import { postsRouter } from "./posts/routers/postRouter";

/**
 * Настраиваем routes, cors, swagger
 * @param app
 */

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса
  //
  // app.use((req, res, next) => {
  //   console.log(`[Incoming] ${req.method} ${req.originalUrl} - body:`, req.body, "query:", req.query);
  //   next();
  // });



  app.get("/", (req, res) => {
    res.send("Hello from API");
  });
  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouter);
  app.use(TESTING_PATH, testingRouter);

  app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
  });

  setupSwagger(app);

  return app;
};
