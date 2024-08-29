import './util/module-alias';

import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import apiSchema from './api.schema.json';

// Open Api
import { OpenApiValidator } from 'express-openapi-validator';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';

import { Server } from '@overnightjs/core';

// Middlewares
import { apiErrorValidator } from '@src/middlewares/api-error-validator';

// Controllers
import { ForecastController } from './controllers/forecast';

// Logger
import logger from './logger';

/**
 * Essa classe é responsável por configurar o servidor.
 */
export class SetupServer extends Server {
  constructor(private port = 3000) {
    super();
  }

  /**
   * Essa função é responsável por configurar o Express
   * para receber requisições com payloads em JSON.
   * */
  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.app.use(cors({ origin: '*' }));
  }

  /**
   * Essa função é responsável por configurar os handlers de erro.
   */
  private setupErrorHandlers(): void {
    this.app.use(apiErrorValidator);
  }

  /**
   * Essa função é responsável por configurar os controllers
   * da aplicação e adicioná-los ao servidor.
   */
  private setupControllers(): void {
    const forecastController = new ForecastController();
    this.addControllers([forecastController]);
  }

  /**
   * Essa função é responsável por configurar a documentação da API.
   */
  private async docsSetup(): Promise<void> {
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSchema));
    await new OpenApiValidator({
      apiSpec: apiSchema as OpenAPIV3.Document,
      validateRequests: true,
      validateResponses: true,
    }).install(this.app);
  }

  /**
   * Essa função é responsável por iniciar o servidor.
   */
  public start(): void {
    this.app.listen(this.port, () => {
      logger.info('Servidor rodando na porta: ' + this.port);
    });
  }

  /**
   * Essa função é responsável por iniciar o servidor.
   */
  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.docsSetup();
    this.setupErrorHandlers();
  }
}
