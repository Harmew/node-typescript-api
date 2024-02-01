import { Response } from 'express';
import mongoose from 'mongoose';

// Enums
import { CUSTOM_VALIDATION } from '@src/models/user';
import logger from '@src/logger';

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(res: Response, err: unknown): void {
    if (err instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientErrors(err);
      res.status(clientErrors.code).send({ code: clientErrors.code, error: clientErrors.error });
    } else {
      logger.error(err as Error);
      res.status(500).send({ code: 500, error: 'Something went wrong!' });
    }
  }

  private handleClientErrors(error: mongoose.Error.ValidationError): { code: number; error: string } {
    const duplicatedKindErrors = Object.values(error.errors).filter((err) => err.name === 'ValidatorError' && err.kind === CUSTOM_VALIDATION.DUPLICATED);
    if (duplicatedKindErrors.length) {
      return { code: 409, error: error.message };
    }
    return { code: 422, error: error.message };
  }
}
