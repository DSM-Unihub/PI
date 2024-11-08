import { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import url from "../services/url";
import axios from "axios";
const EstatisticasMes = () => {
    const [bloqueios, setBloqueios] = useState([])
    const [layout, setLayout] = useState('x')
    
    const fetchBloqueiosMes = async () =>{
      try {
        const response = await axios.get(`${url}/bloqueios-mes`);
        setBloqueios(response.data);
      } catch (error) {
        console.error("Error fetching estatísticas do mês:", error);
        throw error;
      }
    }

    useEffect(()=>{
      fetchBloqueiosMes();
    },[])

      useEffect(() => {
        if(window.innerWidth < 1024){
          setLayout('y')
        }else{
          setLayout('x')
        }
        if(bloqueios.length === 0) return
        const ctx = document.getElementById("grafico-barra").getContext("2d");
    
        const estatisticasPorMes = bloqueios;
        const desktopData = estatisticasPorMes.map((data) => data.desktopBloqueios);
        const mobileData = estatisticasPorMes.map((data) => data.mobileBloqueios);
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
            indexAxis: layout,
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: "Bloqueios",
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
            hover:{
              mode: 'index',
              intersect: false,

            },
            animation: {
              duration: 800,
              easing: "easeInOutQuad",
            },
          },
        });
        return () => {
          myChart.destroy();
        };
      }, [bloqueios]);
   
    return(
        <>
        <div className="flex flex-col w-full">
              <h3 className="text-azul-text text-base">Visão Geral</h3>
              <div className="flex flex-row py-3">
                <canvas
                  id="grafico-barra"
                  className="rounded-s-xl max-h-96  max-w-2xl lg:max-w-xl bg-white"
                ></canvas>
                <div className="flex flex-col w-full bg-cinza rounded-e-xl">
                  {bloqueios.map((item) => (
                    <div
                      key={item.mes}
                      className="grid grid-cols-4 py-1 text-azul-text px-2"
                    >
                      <div className="text-start">
                        <p className="text-base">{item.mes}</p>
                      </div>
                      <div className=" flex flex-row w-fit items-center">
                        <div className="flex flex-row justify-end">
                          <img
                            className="size-4"
                            src="icons/desktopmarker.svg"
                            alt="Desktop Marker"
                          />
                        </div>
                        <div className="flex flex-row justify-end">
                          <p className="text-base">{item.desktopBloqueios}</p>
                        </div>
                      </div>
                      <div className="flex flex-row items-center w-fit ">
                        <div className="flex flex-row justify-end">
                          <img
                            className="size-4"
                            src="/icons/mobilemarker.svg"
                            alt="Mobile Marker"
                          />
                        </div>
                        <div className="flex flex-row justify-end">
                          <p className="text-base">{item.mobileBloqueios}</p>
                        </div>
                      </div>
                      <div
                        className={` rounded-md  flex flex-row justify-self-end items-center gap-1 w-fit text-white ${
                          item.porcentagemVariacaoMesAnterior > 0
                            ? "bg-red-status"
                            : item.porcentagemVariacaoMesAnterior < 0
                            ? "bg-green-500"
                            : "bg-azul-principal"
                        }`}
                      >
                        <div>
                          <p className="text-base">{item.porcentagemVariacaoMesAnterior}%</p>
                        </div>
                        <div className="flex flex-row justify-center items-center">
                          <img
                            src="./icons/arrowW.svg"
                            className={`size-4 ${
                              item.porcentagemVariacaoMesAnterior < '0.00'
                                ? "rotate-180"
                                : item.porcentagemVariacaoMesAnterior === '0.00'
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