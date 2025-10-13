import fs from "fs/promises";

const BLOQUEADOS_PATH = "/root/bloqueados.txt";

async function atualizarArquivoBloqueados(url, bloquear) {
  try {
    const conteudo = await fs.readFile(BLOQUEADOS_PATH, "utf-8");
    const linhas = conteudo.split("\n").map(l => l.trim()).filter(Boolean);

    // Remove o https:// ou http:// antes da busca
    const urlFormatada = url.replace(/^https?:\/\//, "").trim();

    const existe = linhas.includes(urlFormatada);

    if (bloquear && !existe) {
      // Bloqueio: adiciona a URL formatada
      linhas.push(urlFormatada);
      await fs.writeFile(BLOQUEADOS_PATH, linhas.join("\n") + "\n", "utf-8");
      console.log(`URL adicionada ao arquivo de bloqueio: ${urlFormatada}`);
    } else if (!bloquear && existe) {
      // Desbloqueio: remove a URL formatada
      const novasLinhas = linhas.filter(l => l !== urlFormatada);
      await fs.writeFile(BLOQUEADOS_PATH, novasLinhas.join("\n") + "\n", "utf-8");
      console.log(`URL removida do arquivo de bloqueio: ${urlFormatada}`);
    } else {
      console.log(`Nenhuma alteração necessária no arquivo de bloqueio para a URL: ${urlFormatada}`);
    }
  } catch (error) {
    console.error("Erro ao manipular o arquivo de bloqueados:", error);
    throw error;
  }
}


export default atualizarArquivoBloqueados;
