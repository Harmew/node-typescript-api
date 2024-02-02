import './util/module-alias';

import bodyParser from 'body-parser';
// import expressPinoLogger from 'express-pino-logger';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import apiSchema from './api.schema.json';

// Open Api
import { OpenApiValidator } from 'express-openapi-validator';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';

import { Server } from '@overnightjs/core';
import { Application } from 'express';

// Middlewares
import { apiErrorValidator } from '@src/middlewares/api-error-validator';

// Database
import * as database from '@src/database';

// Controllers
import { ForecastController } from './controllers/forecast';
import { BeachesController } from './controllers/beaches';
import { UsersController } from './controllers/users';

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
    // this.app.use(expressPinoLogger());
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
    const beachesController = new BeachesController();
    const usersController = new UsersController();
    this.addControllers([forecastController, beachesController, usersController]);
  }

  /**
   * Essa função é responsável por configurar o banco de dados.
   */
  private async databaseSetup(): Promise<void> {
    await database.connect();
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
   * Essa função é responsável por fechar a conexão com o banco de dados.
   */
  public async close(): Promise<void> {
    await database.close();
  }

  /**
   * Essa função é responsável por retornar a instância do Express.
   * @returns {Application} Instância do Express.
   *
   * @example
   * const server = new SetupServer();
   * server.init();
   * const app = server.getApp();
   * app.listen(3000);
   */
  public getApp(): Application {
    return this.app;
  }

  /**
   * Essa função é responsável por iniciar o servidor.
   */
  public start(): void {
    this.app.listen(this.port, () => {
      logger.info('Server listening on port: ' + this.port);
    });
  }

  /**
   * Essa função é responsável por iniciar o servidor.
   */
  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.docsSetup();
    await this.databaseSetup();
    this.setupErrorHandlers();
  }
}
