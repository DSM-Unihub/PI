import { SquareChevronUpIcon } from "lucide-react";
import Image from 'next/image';
import styles from "./grafico.module.css";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { useState } from "react";

export default function GraficoEst() {
  const dados = [
    { mes: "Jan", moveis: 40, desktop: 30 },
    { mes: "Fev", moveis: 65, desktop: 70 },
    { mes: "Mar", moveis: 190, desktop: 195 },
    { mes: "Abr", moveis: 210, desktop: 220 },
    { mes: "Mai", moveis: 80, desktop: 330 },
    { mes: "Jun", moveis: 120, desktop: 185 },
    { mes: "Jul", moveis: 20, desktop: 78 },
    { mes: "Ago", moveis: 90, desktop: 150 },
    { mes: "Set", moveis: 215, desktop: 285 },
    { mes: "Out", moveis: 165, desktop: 225 },
    { mes: "Nov", moveis: 200, desktop: 100 },
    { mes: "Dez", moveis: 45, desktop: 20 }
  ]
  const [ano, setAno] = useState("Este ano");
  const block = [
    {
      mes: "Janeiro",
      desk: 37,
      mob: 5,
      porcentMesPassado: "-45%",
      flag: 2,
    },
    {
      mes: "Fevereiro",
      desk: 20,
      mob: 45,
      porcentMesPassado: "+90%",
      flag: 1,
    },
    {
      mes: "Março",
      desk: 47,
      mob: 19,
      porcentMesPassado: "-70%",
      flag: 2,
    },
    {
      mes: "Abril",
      desk: 14,
      mob: 12,
      porcentMesPassado: "+8%",
      flag: 1,
    },
    {
      mes: "Maio",
      desk: 3,
      mob: 3,
      porcentMesPassado: "+3%",
      flag: 1,
    },
    {
      mes: "Junho",
      desk: 4,
      mob: 8,
      porcentMesPassado: "-9%",
      flag: 2,
    },
    {
      mes: "Julho",
      desk: 17,
      mob: 14,
      porcentMesPassado: "-70%",
      flag: 2,
    },
    {
      mes: "Agosto",
      desk: 0,
      mob: 2,
      porcentMesPassado: "+7%",
      flag: 1,
    },
    {
      mes: "Setembro",
      desk: 1,
      mob: 5,
      porcentMesPassado: "-20%",
      flag: 2,
    },
    {
      mes: "Outubro",
      desk: 5,
      mob: 10,
      porcentMesPassado: "+15%",
      flag: 1,
    },
    {
      mes: "Novembro",
      desk: 6,
      mob: 12,
      porcentMesPassado: "-2%",
      flag: 2,
    },
    {
      mes: "Dezembro",
      desk: 37,
      mob: 30,
      porcentMesPassado: "+17%",
      flag: 1,
    },
  ];

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
                <BarChart data={dados} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="moveis" fill="#1976d2" />
                  <Bar dataKey="desktop" fill="#64b5f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
          </div>
          
          <div className={styles.datasGraf}>
            {block.map((bloq) => (
              <div className={styles.divLinha}>
                <div className={styles.styleps}>{bloq.mes}</div>
                <div className={styles.numbers}>
                  <div style={{ backgroundColor: '#799BFE' }} className={styles.circle}></div>
                  <p className={styles.stylep}>{bloq.desk}</p>
                </div>
                <div className={styles.numbers}>
                  <div className={styles.circle}></div>
                  <p className={styles.stylep}>{bloq.mob}</p>
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
