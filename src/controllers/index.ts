import { Response } from 'express';
import mongoose from 'mongoose';

// Enums
import { CUSTOM_VALIDATION } from '@src/models/user';
import logger from '@src/logger';
import ApiError, { APIError } from '@src/util/errors/api-error';

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(res: Response, err: unknown): void {
    if (err instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(err);
      res.status(clientErrors.code).send(ApiError.format({ code: clientErrors.code, message: clientErrors.error }));
    } else {
      logger.error(JSON.stringify(err));
      res.status(500).send(ApiError.format({ code: 500, message: 'Something went wrong!' }));
    }
  }

  private handleClientErrors(error: mongoose.Error.ValidationError): { code: number; error: string } {
    const duplicatedKindErrors = Object.values(error.errors).filter((err) => err.name === 'ValidatorError' && err.kind === CUSTOM_VALIDATION.DUPLICATED);
    if (duplicatedKindErrors.length) {
      return { code: 409, error: error.message };
    }
    return { code: 422, error: error.message };
  }

  protected sendErrorResponse(res: Response, apiError: APIError): Response {
    return res.status(apiError.code).send(ApiError.format(apiError));
  }
}
