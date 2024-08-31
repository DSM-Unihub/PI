import { useEffect } from 'react';
import Chart from 'chart.js/auto';
import NavBar from './partials/navBar.js'
import HeaderBar from './partials/headerBar';

export default function Estatisticas({ Mes }) {
  useEffect(() => {
    const ctx = document.getElementById('grafico-barra').getContext('2d');

    const estatisticasPorMes = Mes;
    const desktopData = estatisticasPorMes.map(data => data.desktop);
    const mobileData = estatisticasPorMes.map(data => data.mobile);
    const labels = estatisticasPorMes.map(data => data.mes);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Desktop',
            data: desktopData,
            backgroundColor: '#AFC3FF',
            borderWidth: 1
          },
          {
            label: 'Disp. Móveis',
            data: mobileData,
            backgroundColor: '#2D62FF',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Valor'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Mes'
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            enabled: true
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeInOutQuad'
        }
      }
    });
  }, [Mes]);

  return (
    <section className="flex flex-row justify-start h-screen bg-gradient-to-tr from-cinza-secundario to-cinza-principal w-full max-h-screen">
      <section className="hidden md:flex bg-gradient-to-b from-azul-principal to-azul-nav-fim flex-col p-5 h-screen gap-10">
        <NavBar />
      </section>
      <section className="flex flex-col w-full">
        <section className="flex flex-row items-center justify-between h-fit p-6 gap-32">
            <HeaderBar />
        </section>
        <section className="flex flex-col gap-5 lg:overflow-hidden">
          {/* Dashboard Principal */}
          <section className="grid grid-cols-2 px-5 gap-1">
            <div className="bg-gradient-to-r from-laranja-s h-fit to-laranja-e p-5 rounded-xl">
              <p className="text-4xl text-white">Estatísticas</p>
              <p className="text-2xl text-white">Acesso aos dados de bloqueio.</p>
            </div>
          </section>
          <section className="flex flex-row px-5 gap-2">
            <div className="flex flex-col">
              <h3 className="text-azul-text text-base">Visão Geral</h3>
              <div className="flex flex-row p-3">
                <canvas id="grafico-barra" className="w-fit max-w-4xl h-full max-h-min rounded-s-xl bg-white"></canvas>
                <div className="flex flex-col w-fit bg-cinza rounded-e-xl">
                  {Mes.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 p-2 gap-2 text-azul-text content-center justify-between self-stretch h-full px-5">
                      <div className="text-start">
                        <p className="text-base">{item.mes}</p>
                      </div>
                      <div className="text-end grid grid-cols-2 justify-end">
                        <div className="flex flex-row justify-end">
                          <img className="size-4" src="/icons/desktopmarker.svg" alt="Desktop Marker"/>
                        </div>
                        <div className="flex flex-row justify-end">
                          <p className="text-base">{item.desktop}</p>
                        </div>
                      </div>
                      <div className="text-end grid grid-cols-2 justify-end">
                        <div className="flex flex-row justify-end">
                          <img className="size-4" src="/icons/mobilemarker.svg" alt="Mobile Marker"/>
                        </div>
                        <div className="flex flex-row justify-end">
                          <p className="text-base">{item.mobile}</p>
                        </div>
                      </div>
                      <div className={`text-center rounded-md justify-center grid grid-cols-2 text-white ${item.percent > 0 ? 'bg-red-status' : item.percent < 0 ? 'bg-green-500' : 'bg-azul-principal'}`}>
                        <div>
                          <p className="text-base">{item.percent}%</p>
                        </div>
                        <div className="flex flex-row justify-center items-center">
                          <img src="/icons/arrowWhite.svg" className={`size-4 ${item.percent < 0 ? 'rotate-180' : item.percent === 0 ? '-rotate-90' : ''}`} alt="Arrow"/>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col px-3 gap-3">
              <h3 className="text-azul-text">Últimos Bloqueios na Rede</h3>
              <div className="flex flex-col bg-white rounded-xl justify-between p-3">
                {/* Dados dos bloqueios */}
                {/* Ajuste os dados conforme necessário */}
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="Gradient grid grid-flow-col gap-3 w-fit items-center justify-start">
                    <div className="p-3">
                      <img src={`/icons/bloqBar${index % 2 === 0 ? 'Auto' : 'Manual'}.svg`} alt="Block"/>
                    </div>
                    <div>
                      <img src={`/icons/deskBloq${index % 2 === 0 ? 'Auto' : 'Manual'}.svg`} alt="Desk Block"/>
                    </div>
                    <div>
                      <p className="text-azul-text">Desktop {index + 1}<br/>Laboratório {index + 1}</p>
                    </div>
                    <div className="self-end flex flex-col">
                      <p className="text-azul-text ">28/02/2024 14:57</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>
      </section>
    </section>
  );
}
