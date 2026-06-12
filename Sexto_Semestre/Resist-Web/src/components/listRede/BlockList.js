import { useState, useEffect } from "react";
import url from "../../services/url";
import axios from "axios";
import styles from './blockList.module.css'
import { Trash2 } from "lucide-react";

const BlockList = ({
  tipo,
  unidade,
  dia,
  mes,
  ano,
}) => {
  const [rede, setRede] = useState([]);

  const formatarData = (dataIso) => {
    const data = new Date(dataIso);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  const fetchRede = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get(`${url}/rede`, {
        params: {
          tipo,
          unidade,
          dia,
          mes,
          ano,
        },
      });

      setRede(response.data.data || response.data);
    } catch (error) {
      console.error("Error fetching rede:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      try {
        const token = localStorage.getItem("token");
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        await axios.delete(`${url}/rede/${id}`);
        fetchRede();
      } catch (error) {
        console.error("Erro ao deletar:", error);
      }
    }
  };

  const ipToNumber = (ip) =>
    ip.split(".").reduce((acc, oct) => (acc << 8) + Number(oct), 0);

  const calcularQtdIps = (start, end) => {
    if (!start || !end) return 0;
    return ipToNumber(end) - ipToNumber(start) + 1;
  };

  useEffect(() => {
    fetchRede();
  }, [tipo, unidade, dia, mes, ano]);

  return (
    <div className={styles.tabelaContainer}>
      <div className={styles.tabelaWrapper}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data</th>
              <th>Quant. Dispositivos</th>
              <th>IP Inicial</th>
              <th>IP Final</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {rede.map((item) => (
              <tr key={item._id} className={styles.tabelaRow}>
                <td>{item.nome}</td>
                <td>{formatarData(item.dataHora)}</td>
                <td>{calcularQtdIps(item.ipStart, item.ipEnd)}</td>
                <td>{item.ipStart}</td>
                <td>{item.ipEnd}</td>
                <td>
                  <button onClick={() => handleDelete(item._id)}>
                    <Trash2 className="text-red-500 w-5 h-5 cursor-pointer" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlockList;
