import './util/module-alias';

import bodyParser from 'body-parser';

import { Server } from '@overnightjs/core';
import { Application } from 'express';

// Controllers
import { ForecastController } from './controllers/forecast';

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
  public init(): void {
    this.setupExpress();
    this.setupControllers();
  }
}
