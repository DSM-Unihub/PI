import { useEffect, useState } from "react";
import { Chart } from "chart.js";
import Image from "next/image";

const Laboratorios = (laboratorios) => {
  useEffect(() => {
    laboratorios.forEach((laboratorio) => {
      const ctx = document
        .getElementById(laboratorio.laboratorio)
        .getContext("2d");
      new Chart(ctx, {
        type: "doughnut",
        data: {
          datasets: [
            {
              label: `Lab-${laboratorio.laboratorio}`,
              data: [
                100 - laboratorio.porcentagem_acessos,
                laboratorio.porcentagem_acessos,
              ],
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
    });
  }, [laboratorios]);
  return (
    <div classNameName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {laboratorios.map((laboratorio) => (
        <div
          key={laboratorio.laboratorio}
          classNameName="bg-azul-principal rounded-xl h-max"
        >
          <p classNameName="text-white text-base p-3 text-center">
            {laboratorio.laboratorio}
          </p>
          <div classNameName="bg-white h-max rounded-b-xl flex flex-row justify-center items-center p-2 relative">
            <canvas
              id={laboratorio.laboratorio}
              classNameName="w-max max-h-40"
            ></canvas>
            <p classNameName="text-azul-text text-xl absolute z-10">
              {laboratorio.porcentagem_acessos}%
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Laboratorios();
