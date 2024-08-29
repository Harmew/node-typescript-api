import { Response } from 'express';

// Enums
import ApiError, { APIError } from '@src/util/errors/api-error';

export abstract class BaseController {
  protected sendErrorResponse(res: Response, apiError: APIError): Response {
    return res.status(apiError.code).send(ApiError.format(apiError));
  }
}
