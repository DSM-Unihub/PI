import {
  listarUrls,
  buscarUrl,
  adicionarUrl,
  removerUrl,
} from "../utils/listaBloqueadosArquivo.js";

const listaBloqueadosService = {
  listar(tipo) {
    return listarUrls(tipo);
  },

  buscar(tipo, url) {
    return buscarUrl(tipo, url);
  },

  adicionar(tipo, url) {
    return adicionarUrl(tipo, url);
  },

  remover(tipo, url) {
    return removerUrl(tipo, url);
  },
};

export default listaBloqueadosService;
