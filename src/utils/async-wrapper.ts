import { RequestHandler, ParamsDictionary, Params, Request, Response, NextFunction } from 'express-serve-static-core';
import Error from '../error-handler';
import { reqBody } from 'typings/express';

type body = { [k: string]: string | number | boolean | body }

interface Wrapper <ReqParams extends Params = ParamsDictionary, ResBody = any, ReqBody = any> {
  (handler: RequestHandler<ReqParams, ResBody, ReqBody>):
    RequestHandler<ReqParams, ResBody, ReqBody>;
}

const Wrapper = <ReqParams extends Params = ParamsDictionary, ResBody = any, ReqBody = any>
  (func: RequestHandler<ReqParams, ResBody, ReqBody>): RequestHandler<ReqParams, ResBody, reqBody> => {
  return (req: Request<ReqParams, ResBody, ReqBody>, res: Response, next: NextFunction): void => {
    func(req, res, next)
      .catch((err: Error) => (err.isCustomError ? next(err) : next(new Error(err))));
  };
};

export default Wrapper;
