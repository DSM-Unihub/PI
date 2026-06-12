import { atualizarEntrada } from "./listaBloqueadosArquivo.js";

async function atualizarArquivoBloqueados(url, bloquear) {
  try {
    await atualizarEntrada("bloqueados", url, bloquear);
  } catch (error) {
    console.error("Erro ao manipular o arquivo de bloqueados:", error);
    throw error;
  }
}

export default atualizarArquivoBloqueados;
