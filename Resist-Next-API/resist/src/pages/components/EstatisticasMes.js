import { useState, useEffect } from "react";
import Chart from "chart.js/auto";

const EstatisticasMes = () => {
    const Mes = [
        { mes: "Jan", mobile: 11, desktop: 21, percent: 10 },
        { mes: "Fev", mobile: 12, desktop: 22, percent: 10 },
        { mes: "Mar", mobile: 13, desktop: 23, percent: 10 },
        { mes: "Abr", mobile: 14, desktop: 24, percent: 10 },
        { mes: "Mai", mobile: 15, desktop: 25, percent: 10 },
        { mes: "Jun", mobile: 61, desktop: 62, percent: 10 },
        { mes: "Jul", mobile: 71, desktop: 72, percent: -10 },
        { mes: "Ago", mobile: 81, desktop: 80, percent: 10 },
        { mes: "Set", mobile: 91, desktop: 92, percent: 10 },
        { mes: "Out", mobile: 100, desktop: 200, percent: 10 },
        { mes: "Nov", mobile: 110, desktop: 210, percent: 10 },
        { mes: "Dez", mobile: 120, desktop: 220, percent: -10 },
      ];
      useEffect(() => {
        const ctx = document.getElementById("grafico-barra").getContext("2d");
    
        const estatisticasPorMes = Mes;
        const desktopData = estatisticasPorMes.map((data) => data.desktop);
        const mobileData = estatisticasPorMes.map((data) => data.mobile);
        const labels = estatisticasPorMes.map((data) => data.mes);
    
        const myChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Desktop",
                data: desktopData,
                backgroundColor: "#AFC3FF",
                borderWidth: 1,
              },
              {
                label: "Disp. Móveis",
                data: mobileData,
                backgroundColor: "#2D62FF",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Valor",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Mes",
                },
              },
            },
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
              tooltip: {
                enabled: true,
              },
            },
            animation: {
              duration: 1000,
              easing: "easeInOutQuad",
            },
          },
        });
        return () => {
          myChart.destroy();
        };
      }, [Mes]);
    
    
    return(
        <>
        <div className="flex flex-col">
              <h3 className="text-azul-text text-base">Visão Geral</h3>
              <div className="flex flex-row p-3">
                <canvas
                  id="grafico-barra"
                  className="w-fit max-w-4xl h-full max-h-min rounded-s-xl bg-white"
                ></canvas>
                <div className="flex flex-col w-fit bg-cinza rounded-e-xl">
                  {Mes.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 p-2 gap-2 text-azul-text content-center justify-between self-stretch h-full px-5"
                    >
                      <div className="text-start">
                        <p className="text-base">{item.mes}</p>
                      </div>
                      <div className="text-end grid grid-cols-2 justify-end">
                        <div className="flex flex-row justify-end">
                          <img
                            className="size-4"
                            src="icons/desktopmarker.svg"
                            alt="Desktop Marker"
                          />
                        </div>
                        <div className="flex flex-row justify-end">
                          <p className="text-base">{item.desktop}</p>
                        </div>
                      </div>
                      <div className="text-end grid grid-cols-2 justify-end">
                        <div className="flex flex-row justify-end">
                          <img
                            className="size-4"
                            src="/icons/mobilemarker.svg"
                            alt="Mobile Marker"
                          />
                        </div>
                        <div className="flex flex-row justify-end">
                          <p className="text-base">{item.mobile}</p>
                        </div>
                      </div>
                      <div
                        className={`text-center rounded-md justify-center grid grid-cols-2 text-white ${
                          item.percent > 0
                            ? "bg-red-status"
                            : item.percent < 0
                            ? "bg-green-500"
                            : "bg-azul-principal"
                        }`}
                      >
                        <div>
                          <p className="text-base">{item.percent}%</p>
                        </div>
                        <div className="flex flex-row justify-center items-center">
                          <img
                            src="./icons/arrowW.svg"
                            className={`size-4 ${
                              item.percent < 0
                                ? "rotate-180"
                                : item.percent === 0
                                ? "-rotate-90"
                                : ""
                            }`}
                            alt="Arrow"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </>
    )
}

export default EstatisticasMes;