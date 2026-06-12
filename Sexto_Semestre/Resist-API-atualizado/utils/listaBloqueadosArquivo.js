import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");

export const BLOQUEADOS_PATH =
  process.env.BLOQUEADOS_PATH?.trim() || path.join(DATA_DIR, "bloqueados.txt");

export const BLOQUEADOS_TOTAL_PATH =
  process.env.BLOQUEADOS_TOTAL_PATH?.trim() ||
  path.join(DATA_DIR, "bloqueados_total.txt");

const PATHS = {
  bloqueados: BLOQUEADOS_PATH,
  total: BLOQUEADOS_TOTAL_PATH,
};

export function formatUrl(url) {
  return String(url || "")
    .replace(/^https?:\/\//, "")
    .trim()
    .toLowerCase();
}

async function ensureFile(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, "", "utf-8");
  }
}

async function readLines(filePath) {
  await ensureFile(filePath);
  const conteudo = await fs.readFile(filePath, "utf-8");
  return conteudo
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

async function writeLines(filePath, linhas) {
  await ensureFile(filePath);
  const texto = linhas.length ? `${linhas.join("\n")}\n` : "";
  await fs.writeFile(filePath, texto, "utf-8");
}

function resolvePath(tipo) {
  const filePath = PATHS[tipo];
  if (!filePath) {
    throw new Error(`Tipo de lista inválido: ${tipo}`);
  }
  return filePath;
}

export async function listarUrls(tipo) {
  const linhas = await readLines(resolvePath(tipo));
  return linhas.map((url) => ({ url }));
}

export async function buscarUrl(tipo, url) {
  const urlFormatada = formatUrl(url);
  if (!urlFormatada) {
    throw new Error("URL é obrigatória.");
  }
  const linhas = await readLines(resolvePath(tipo));
  const encontrada = linhas.find((l) => formatUrl(l) === urlFormatada);
  if (!encontrada) {
    return null;
  }
  return { url: encontrada };
}

export async function adicionarUrl(tipo, url) {
  const urlFormatada = formatUrl(url);
  if (!urlFormatada) {
    throw new Error("URL é obrigatória.");
  }
  const filePath = resolvePath(tipo);
  const linhas = await readLines(filePath);
  const existe = linhas.some((l) => formatUrl(l) === urlFormatada);
  if (existe) {
    return { url: urlFormatada, created: false };
  }
  linhas.push(urlFormatada);
  await writeLines(filePath, linhas);
  return { url: urlFormatada, created: true };
}

export async function removerUrl(tipo, url) {
  const urlFormatada = formatUrl(url);
  if (!urlFormatada) {
    throw new Error("URL é obrigatória.");
  }
  const filePath = resolvePath(tipo);
  const linhas = await readLines(filePath);
  const novasLinhas = linhas.filter((l) => formatUrl(l) !== urlFormatada);
  if (novasLinhas.length === linhas.length) {
    return { url: urlFormatada, removed: false };
  }
  await writeLines(filePath, novasLinhas);
  return { url: urlFormatada, removed: true };
}

/** Compatível com sync a partir de bloqueios MongoDB (bloqueio total / mitm). */
export async function atualizarEntrada(tipo, url, bloquear) {
  if (bloquear) {
    await adicionarUrl(tipo, url);
  } else {
    await removerUrl(tipo, url);
  }
}
