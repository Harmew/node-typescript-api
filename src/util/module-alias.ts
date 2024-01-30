import * as path from 'path';
import moduleAlias from 'module-alias';

/**
 * __dirname: Retorna o diretório do arquivo atual
 * ../..: Retorna o diretório anterior ao atual
 *
 * @description Lista todos os arquivos apartir do diretório anterior
 */
const files = path.resolve(__dirname, '../..');

/**
 * @description Adiciona o ALIAS para o diretório src e test
 */
moduleAlias.addAliases({
  '@src': path.join(files, 'src'),
  '@test': path.join(files, 'test'),
});
