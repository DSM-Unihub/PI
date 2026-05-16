import fs from "fs/promises";

const BLOQUEADOS_PATH = "/root/bloqueados.txt";

async function atualizarArquivoBloqueados(url, bloquear) {
  try {
    const conteudo = await fs.readFile(BLOQUEADOS_PATH, "utf-8");
    const linhas = conteudo.split("\n").map(l => l.trim()).filter(Boolean);

    const existe = linhas.includes(url);

    if (bloquear && !existe) {
      // Bloqueio: adiciona a URL
      linhas.push(url);
      await fs.writeFile(BLOQUEADOS_PATH, linhas.join("\n") + "\n", "utf-8");
      console.log(`URL adicionada ao arquivo de bloqueio: ${url}`);
    } else if (!bloquear && existe) {
      // Desbloqueio: remove a URL
      const novasLinhas = linhas.filter(l => l !== url);
      await fs.writeFile(BLOQUEADOS_PATH, novasLinhas.join("\n") + "\n", "utf-8");
      console.log(`URL removida do arquivo de bloqueio: ${url}`);
    } else {
      console.log(`Nenhuma alteração necessária no arquivo de bloqueio para a URL: ${url}`);
    }
  } catch (error) {
    console.error("Erro ao manipular o arquivo de bloqueados:", error);
    throw error;
  }
}

export default atualizarArquivoBloqueados;
