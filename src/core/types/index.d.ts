
import * as express from 'express';
import {WithId} from "mongodb";
import {User} from "../../users/domain/user";
declare global {
  namespace Express {
    export interface Request {
      user?: WithId<User>
    }
  }
}
