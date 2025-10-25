import * as express from "express";
import {JwtPayload} from "../../auth/JWT/JwtPayload";

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload
    }
  }
}
