import Chart from "chart.js/auto";
import { useRef, useEffect } from "react";
const Incidencia = () => {
  const chartRef = useRef(null);
  useEffect(() => {
    const ctx = document.getElementById("LaboratorioTeste").getContext("2d");
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            label: "Lab - Laboratorio Teste",
            data: [100 - 50, 50],
            borderWidth: 1,
            backgroundColor: ["#DEE4F7", "#F23A13"],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false, // Oculta a legenda
          },
          tooltip: {
            enabled: false, // Desabilita as dicas de ferramentas
          },
        },
        cutout: "65%", // Define a porcentagem de corte
      },
    });
  }, []);
  return (
    <>
      {/* Graficos de Incidencia por sala */}
      <div class=" flex flex-col gap-4 justify-self-center ">
        <p class="text-base text-start text-azul-cinza-escuro">
          Nível de incidência por laboratório
        </p>
        <div className="flex flex-row gap-4">
          {/* Graficos */}
          <div class="flex flex-row gap-3">
            {/* Lab */}
            <div class="bg-azul-principal rounded-xl h-max">
              <p class="text-white text-base p-3 text-center">
                Laboratorio Teste
              </p>
              {/* canvas */}
              <div class="bg-white h-max rounded-b-xl flex flex-row justify-center items-center p-2 relative">
                <canvas id="LaboratorioTeste" class="w-max max-h-40"></canvas>
                <p class="text-azul-text text-xl absolute z-10">50%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Incidencia;
