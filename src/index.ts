import config from 'config';

// Logger
import logger from './logger';

// Server
import { SetupServer } from './server';

enum ExitStatus {
  Failure = 1,
  Success = 0,
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Aplicação encerrada devido a uma promise não tratada: ${promise} e motivo: ${reason}`);
  throw reason;
});

process.on('uncaughtException', (error) => {
  logger.error(`Aplicação encerrada devido a uma exceção não tratada: ${error}`);
  process.exit(ExitStatus.Failure);
});

(async (): Promise<void> => {
  try {
    const server = new SetupServer(config.get('App.port'));
    await server.init();
    server.start();

    // Criando um array com os sinais de saída
    // Ex: Ctrl+C, SIGTERM, etc
    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

    // Adicionando um listener para cada sinal de saída
    exitSignals.map((signal) =>
      process.on(signal, async () => {
        try {
          logger.info(`Aplicação encerrada com sucesso`);
          process.exit(ExitStatus.Success);
        } catch (err) {
          // Caso ocorra um erro ao encerrar o servidor
          logger.error(`Ocorreu um erro ao encerrar a aplicação: ${err}`);
          process.exit(ExitStatus.Failure);
        }
      })
    );
  } catch (err) {
    logger.error(`Aplicação encerrada com erro: ${err}`);
    process.exit(ExitStatus.Failure);
  }
})();
