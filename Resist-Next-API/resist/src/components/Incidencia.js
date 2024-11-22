import Chart from "chart.js/auto";
import { useRef, useEffect, useState } from "react";
import url from "../services/url";
import axios from "axios";
import Image from "next/image";

const Incidencia = () => {
  const [labs, setLabs] = useState([])
  const chartRef = useRef({});

  // Função para buscar os dados dos bloqueios
  const fetchLabs = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${url}/estatisticas-labs`);
      setLabs(response.data.estatisticasLaboratorios); // Atualiza o estado com os dados dos laboratórios
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);


  useEffect(() => {
    // Pre-renderiza todos os gráficos de uma vez
    if(labs.length > 0) {
    labs.forEach((lab) => {
      const canvas = document.getElementById(`${lab.laboratorio}`);

      if (canvas && !chartRef.current[lab.laboratorio]) {
        const ctx = canvas.getContext("2d");

        chartRef.current[lab.laboratorio] = new Chart(ctx, {
          type: "doughnut",
          data: {
            datasets: [
              {
                label: `${lab.laboratorio}`,
                data: [100 - lab.porcentagem, lab.porcentagem],
                borderWidth: 1,
                backgroundColor: ["#DEE4F7", "#F23A13"],
              },
            ],
          },
          options: {
            plugins: {
              legend: { display: false },
              tooltip: { enabled: false },
            },
            cutout: "67%",
          },
        });
      }
    });
  }
  }, [labs]); // Executa apenas uma vez no carregamento

  return (
    <>
      <div className="component-container xl:p-2 ">
        <h1 className="title">
          Nível de incidência por laboratório
        </h1>

        <div className="overflow-x-auto relative flex w-full">
          <div className="flex flex-row lg:flex lg:flex-row lg:flex-wrap lg:justify-between gap-3 py-2">
            {labs.map((lab) => (
              <div
                key={lab.laboratorio}
                className="bg-azul-principal rounded-xl flex-shrink-0 w-fit"
              >
                <p className="text-white text-base p-2 text-center">
                  {lab.laboratorio}
                </p>
                <div className="bg-white flex flex-row justify-center items-center h-fit w-full rounded-b-xl p-1 relative">
                  <canvas id={`${lab.laboratorio}`} className="w-full max-h-28 lg:max-h-30 xl:max-h-42"></canvas>
                  <p className="text-azul-text text-xl absolute z-10">
                    {lab.porcentagem}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Incidencia;
