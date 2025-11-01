import { useState, useEffect } from "react";
import url from "../../services/url";
import axios from "axios";
import styles from './listaHistorico.module.css'
import { useRouter } from "next/router";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
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

const ListHistorico = () => {
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

const mockData = [
  {
    _id: "1",
    acao: "bloqueio",
    dataHora: "2025-10-29T09:30:00Z",
    usuario: "Mauricio Bertoldo",
    justificativa: "Usuário tentou acesso indevido.",
    alvo: { nome: "João Silva",valor:"Site: www.google.com" },
    autor: { nome: "João Silva",valor:"Site: www.google.com" }

  },
  {
    _id: "2",
    acao: "desbloqueio",
    dataHora: "2025-10-29T10:15:00Z",
    usuario: "Admin Sistema",
    justificativa: "Acesso autorizado após verificação.",
    alvo: { nome: "Maria Souza",valor:"Site: www.google.com" },
    autor: { nome: "Maria Souza",valor:"Site: www.google.com" }

  },
  {
    _id: "3",
    acao: "bloqueio",
    dataHora: "2025-10-28T17:45:00Z",
    usuario: "Mauricio Bertoldo",
    justificativa: "Múltiplas tentativas de login falhadas.",
    alvo: { nome: "Carlos Pereira",valor:"Site: www.google.com" },
    autor: { nome: "Carlos Pereira",valor:"Site: www.google.com" }

  },
  {
    _id: "4",
    acao: "desbloqueio",
    dataHora: "2025-10-27T13:20:00Z",
    usuario: "Admin Sistema",
    justificativa: "Usuário comprovou identidade.",
    alvo: { nome: "Fernanda Lima",valor:"Site: www.google.com" },
    autor: { nome: "Fernanda Lima",valor:"Site: www.google.com" }

  },
  {
    _id: "5",
    acao: "bloqueio",
    dataHora: "2025-10-25T08:10:00Z",
    usuario: "Mauricio Bertoldo",
    justificativa: "Atividade suspeita detectada.",
    alvo: { nome: "Evendo do Sistema",valor:"Site: www.google.com" },
    autor: { nome: "Evendo do Sistema",valor:"Site: www.google.com" }

  }
];

  useEffect(() => {
    const ListHistorico = async () => {
      try {
        const token = localStorage.getItem("token");
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const resposta = await axios.get(`${url}/logs`)
        setsugestao(resposta.data)
      } catch (error) {
        console.log(error)
      }
    }
    ListHistorico();
  }, []);

//   useEffect(() => {
//   setsugestao(mockData);
// }, []);

  return (
    <div className={styles.tabelaContainer}>
      

      <div className={styles.tabelaWrapper}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Ação Realizada</th>
              <th>Data</th>
              <th>Usuário</th>
              <th>Justificativa</th>
              <th>Alvo</th>

            </tr>
          </thead>
          <tbody>
            {sugestao.map((bloq) => (
              <tr
                key={bloq._id}
                className={styles.tabelaRow}
                >
                <td>{bloq.acao == 'bloqueio'? <LockClosedIcon className="w-6 h-6 text-red-500"/> : <LockOpenIcon className="w-6 h-6 text-green-500"/>}</td>
                <td>{bloq.acao}</td>
                <td>{formatarData(bloq.dataHora)}</td>
                <td>{bloq.autor.nome}</td>
                <td>{bloq.justificativa}</td>
                <td>{bloq.alvo.valor == ""? 'Evento do Sistema':bloq.alvo.nome }</td>
                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListHistorico;
