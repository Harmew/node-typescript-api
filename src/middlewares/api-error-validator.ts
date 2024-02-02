import { Request, Response, NextFunction } from 'express';
import ApiError from '@src/util/errors/api-error';

export interface HTTPError extends Error {
  status?: number;
}

/**
 * This function is responsible for validating the API errors.
 * @param error
 * @param req
 * @param res
 * @param _
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function apiErrorValidator(error: HTTPError, req: Partial<Request>, res: Response, _: NextFunction): void {
  const errorCode = error.status || 500;
  res.status(errorCode).send(ApiError.format({ code: errorCode, message: error.message }));
}
