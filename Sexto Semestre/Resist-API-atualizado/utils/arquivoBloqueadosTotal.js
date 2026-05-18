import { atualizarEntrada } from "./listaBloqueadosArquivo.js";

async function atualizarArquivoBloqueadosTotal(url, bloquear) {
  try {
    await atualizarEntrada("total", url, bloquear);
  } catch (error) {
    console.error("Erro ao manipular o arquivo de bloqueados total:", error);
    throw error;
  }
}

export default atualizarArquivoBloqueadosTotal;
