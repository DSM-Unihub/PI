import { useState, useEffect } from "react";
import url from "../../services/url";
import axios from "axios";
import styles from './listaSugestao.module.css'
import { useRouter } from "next/router";
const teste = [{
  "idUser": 1,
  "dataHora": "1715395200000",
  "url": "https",
  "motivo": "preto",
  "tipo": "Preto",
  "situacao": true,
  "foto": "preto"
},
{
  "idUser": 1,
  "dataHora": "1715395200000",
  "url": "https",
  "motivo": "preto",
  "tipo": "Preto",
  "situacao": true,
  "foto": "preto"
}
]

const ListSujestao = () => {
  const [sugestao, setsugestao] = useState([]);
  const router = useRouter();
  // Formatar data para o formato desejado (DD/MM/YYYY)
  const formatarData = (dataIso) => {
    const data = new Date(dataIso);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  // Função para buscar as sugestao 


  useEffect(() => {
    const listarSugestao = async () => {
      try {
        const resposta = await axios.get(`${url}/sugestao`)
        setsugestao(resposta.data)
      } catch (error) {
        console.log(error)
      }
    }
    listarSugestao();
  }, []);

  const handleEdit = (sugestao) => {
    router.push({
      pathname: "DetalhesSuges/detalhesSuges",
      query: { id: sugestao._id }
    })
  }

  return (
    <div className={styles.tabelaContainer}>
     

      <div className={styles.tabelaWrapper}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>URL Bloqueado</th>
              <th>Data</th>
              <th>Motivo informado</th>
              <th>Tipo de solicitação</th>
              <th>Situação</th>
            </tr>
          </thead>
          <tbody>
            {sugestao.map((bloq) => (
              <tr
                key={bloq._id}
                onClick={() => handleEdit(bloq)}
                className={styles.tabelaRow}
              >
                <td className={styles.urlCell}>{bloq.url}</td>
                <td>{formatarData(bloq.dataHora)}</td>
                <td>{bloq.motivo}</td>
                <td>{bloq.tipo ? "Bloqueio" : "Desbloqueio"}</td>
                <td>{bloq.situacao}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListSujestao;
