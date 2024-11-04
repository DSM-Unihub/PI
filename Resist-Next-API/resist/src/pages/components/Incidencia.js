import Chart from "chart.js/auto";
import { useRef, useEffect } from "react";

const Incidencia = () => {
  const data = [
    { index: 0, value: 100, labName: "Lab 00" },
    { index: 1, value: 50, labName: "Lab 01" },
    { index: 2, value: 22, labName: "Lab 02" },
    { index: 3, value: 34, labName: "Lab 03" },
    { index: 4, value: 40, labName: "Lab 04" },
    { index: 5, value: 55, labName: "Lab 05" },
    { index: 6, value: 55, labName: "Lab 06" },
    { index: 7, value: 55, labName: "Lab 07" },
  ];

  const chartRef = useRef({});

  useEffect(() => {
    // Pre-renderiza todos os gráficos de uma vez
    data.forEach((dados) => {
      const canvas = document.getElementById(`${dados.labName}`);

      if (canvas && !chartRef.current[dados.labName]) {
        const ctx = canvas.getContext("2d");

        chartRef.current[dados.labName] = new Chart(ctx, {
          type: "doughnut",
          data: {
            datasets: [
              {
                label: `${dados.labName}`,
                data: [100 - dados.value, dados.value],
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
  }, []); // Executa apenas uma vez no carregamento

  return (
    <>
      <div className="component-container xl:p-2 ">
        <h1 className="title">
          Nível de incidência por laboratório
        </h1>

        <div className="overflow-x-auto relative flex w-full">
          <div className="flex flex-row lg:flex lg:flex-row lg:flex-wrap lg:justify-between gap-3 py-2">
            {data.map((dados) => (
              <div
                key={dados.labName}
                className="bg-azul-principal rounded-xl flex-shrink-0 w-fit"
              >
                <p className="text-white text-base p-2 text-center">
                  {dados.labName}
                </p>
                <div className="bg-white flex flex-row justify-center items-center h-fit w-fit rounded-b-xl p-1 relative">
                  <canvas id={`${dados.labName}`} className="w-full max-h-28 lg:max-h-30 xl:max-h-42"></canvas>
                  <p className="text-azul-text text-xl absolute z-10">
                    {dados.value}%
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
