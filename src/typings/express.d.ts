import 'express';
import * as core from "express-serve-static-core";
import { ReqBody } from 'express';

type reqBody = ReqBody;

declare module 'express' {
  export interface ReqBody {
    [key: string]: any;
  }

  export interface Response {
    testing: string;
  }

  interface Request1<P extends core.Params = core.ParamsDictionary, Q extends ReqBody = ReqBody, R extends ReqBody = ReqBody> extends core.Request<P, Q, R> { }

}