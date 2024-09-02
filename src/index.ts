// Logger
import logger from './logger';

// Server
import { SetupServer } from './server';

enum ExitStatus {
  Failure = 1,
  Success = 0,
}

(async (): Promise<void> => {
  try {
    const server = new SetupServer();
    await server.init();
    server.start();

    const exitSignals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM', 'SIGQUIT'];

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
