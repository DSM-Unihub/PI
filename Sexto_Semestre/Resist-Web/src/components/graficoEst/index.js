import { SquareChevronUpIcon } from "lucide-react";
import Image from "next/image";
import styles from "./grafico.module.css";
import axios from "axios";

import url from "../../services/url";
import {
  useState,
  useEffect,
} from "react";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


export default function GraficoEst() {
const [
  dadosGrafico,
  setDadosGrafico,
] = useState([]);
 const [ano, setAno] = useState("Este ano");
const [
  dadosBlock,
  setDadosBlock,
] = useState([]);
 
useEffect(() => {
  const fetchEstatisticas =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

const response =
  await axios.get(
    `${url}/rede/estatisticas-bloqueios`
  );

console.log(
  "API BLOQUEIOS:",
  response.data
);

setDadosGrafico(
  response.data.data
    .dados || []
);

setDadosBlock(
  response.data.data
    .block || []
);
      } catch (error) {
        console.error(
          "Erro ao buscar estatísticas:",
          error
        );
      }
    };

  fetchEstatisticas();
}, []);
  const formatarData = (dataIso) => {
    const data = new Date(dataIso);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };
  return (

    <section style={{ flex: 3, minWidth: "70%", display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: "100%", width: "100%", display: 'flex', flexDirection: 'column' }}>

        <div>
          <p className={styles.stylep}>Visão Geral</p>
        </div>
        <div className={styles.cardTipoBloc}>
          <div className={styles.estatis}>
            <section className={styles.content}>
            <div className={styles.header}>
              <h2>Comparativo Mensal</h2>
              <select
                className={styles.selectAno}
                value={ano}
                onChange={(e) => setAno(e.target.value)}
              >
                <option>Este ano</option>
                <option>Último ano</option>
              </select>
            </div>

            <div className={styles.grafico}>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar   dataKey="bloqueios" fill="#1976d2" />
                  <Bar dataKey="desbloqueios" fill="#64b5f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          </div>
          
          <div className={styles.datasGraf}>
            {dadosBlock.map(
  (
    bloq,
    index
  ) => (
    <div
      key={`${bloq.mes}-${index}`}
      className={
        styles.divLinha
      }
    >
                <div className={styles.styleps}>{bloq.mes}</div>
                <div className={styles.numbers}>
                  <div style={{ backgroundColor: '#799BFE' }} className={styles.circle}></div>
                  <p className={styles.stylep}>{bloq.bloqueios}</p>
                </div>
                <div className={styles.numbers}>
                  <div className={styles.circle}></div>
                  <p className={styles.stylep}>{bloq.desbloqueios}</p>
                </div>
                <div className={styles}>
                  <div className={styles.quadrado} style={{
                    backgroundColor: bloq.flag === 1 ? '#69DD4B' : undefined
                  }}>
                    <p style={{ color: 'white' }} className={styles.stylep}>{bloq.porcentMesPassado}</p>


                    {bloq.flag === 1 ? (
                      <ChevronUpIcon className={styles.icon2} />
                    ) : (
                      <ChevronDownIcon className={styles.icon2} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
