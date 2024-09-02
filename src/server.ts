import './util/module-alias';

import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import apiSchema from './api.schema.json';

import { Server } from '@overnightjs/core';
import { json } from 'express';

// Middlewares
import { apiErrorValidator } from '@src/middlewares/api-error-validator';

// Controllers
import { RatingController } from './controllers/rating';

// Logger
import logger from './logger';

export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  private setupExpress(): void {
    this.app.use(json());
    this.app.use(cors({ origin: '*' }));
  }

  private setupErrorHandlers(): void {
    this.app.use(apiErrorValidator);
  }

  private setupControllers(): void {
    const ratingController = new RatingController();
    this.addControllers([ratingController]);
  }

  private async docsSetup(): Promise<void> {
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSchema));
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info('Servidor rodando na porta: ' + this.port);
    });
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.docsSetup();
    this.setupErrorHandlers();
  }
}
