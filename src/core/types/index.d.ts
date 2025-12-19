import * as express from "express";
import { WithId } from "mongodb";
declare global {
  namespace Express {
    export interface Request {
      user: WithId<User>;
    }
  }
}
