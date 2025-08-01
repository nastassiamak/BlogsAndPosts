import express, { Express } from "express";
import {
  AUTH_PATH,
  BLOGS_PATH,
  COMMENTS_PATH,
  POSTS_PATH,
  TESTING_PATH,
  USERS_PATH,
} from "./core/paths/paths";
import { blogsRouter } from "./blogs/routers/blogsRouter";
import { testingRouter } from "./testing/routers/testingRouter";
import { postsRouter } from "./posts/routers/postRouter";
import { usersRouter } from "./users/routers/usersRouter";
import { authRouter } from "./auth/authRouter";
import { setupSwagger } from "./core/swagger/setupSwagger";
import { commentRouter } from "./comments/routers/commentRouter";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  app.use((req, res, next) => {
    console.log(
      `[Incoming] ${req.method} ${req.originalUrl} - body:`,
      req.body,
      "query:",
      req.query,
    );
    next();
  });

  app.get("/", (req, res) => {
    res.send("Hello from API");
  });

  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRouter);
  app.use(COMMENTS_PATH, commentRouter);
  app.use(TESTING_PATH, testingRouter);
  app.use(USERS_PATH, usersRouter);
  app.use(AUTH_PATH, authRouter);

  app.use((req, res, next) => {
    console.log(`[Request] ${req.method} ${req.url}`);
    next();
  });

  app.use((req, res, next) => {
    console.log(
      `\n[${new Date().toISOString()}] Method: ${req.method} URL: ${req.originalUrl}`,
    );
    console.log("Query params:", req.query);
    console.log("Body params:", req.body); // если есть тело
    next();
  });

  //setupSwagger(app);

  return app;
};
