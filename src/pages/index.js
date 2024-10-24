import { Inter } from "next/font/google";
import HeaderBar from "./components/HeaderBar.js";
import NavBar from "./components/NavBar.js";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import Head from "next/head.js";

// Load the Inter font
const inter = Inter({ subsets: ["latin"] });
const usuario = "Daniel"; // User's name

export default function Home() {
  return (
    <>
      <Head>
        <title>Resist</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="container-principal">
        {/* Left Navigation Bar */}
        <nav>
          <NavBar />
        </nav>

        {/* Main Content Area */}
        <section className="main-container">
          <div className="header-container">
            <HeaderBar />
            {/* Welcome Message for Mobile */}
            <div className="flex md:hidden flex-col text-wrap h-fit p-5">
              <p className="text-2xl text-white">Olá, {usuario}</p>
              <p className="text-lg text-white">
                Bem-vindo de volta ao seu dashboard.
              </p>
            </div>
          </div>

          <section className="home-container">
            {/* Left Dashboard Section */}
            <div className="dashLeft-container">
              
              {/* Welcome Section for Desktop */}
              <div className="welcomeArea">
                <p className="text-4xl text-white">Olá, {usuario}</p>
                <p className="text-2xl text-white">
                  Bem-vindo de volta ao seu dashboard.
                </p>
              </div>
              
              {/* Graph Overview Section */}
              <GraphOverview/>

              {/* Total Lockdowns Section */}
              <TotalLockdowns />

              {/* Recent Activity Section */}
              <RecentActivity />

              {/* General Lockdowns Overview */}
              <GeneralLockdowns />
            </div>

            {/* Right Dashboard Section */}
            <RightDashboard />
          </section>
        </section>
      </section>
    </>
  );
}

// Graficos
const GraphOverview = ({ mesData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    const desktopData = mesData.map((data) => data.desktop);
    const mobileData = mesData.map((data) => data.mobile);
    const labels = mesData.map((data) => data.mes);

    new Chart(ctx, {
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
              text: "Mês",
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
  }, [mesData]);

  return (
    <div className="flex flex-col">
      <h3 className="text-azul-text text-base">Visão Geral</h3>
      <div className="flex flex-row p-3">
        <canvas
          ref={chartRef}
          className="w-fit max-w-4xl h-full max-h-min rounded-s-xl bg-white"
        ></canvas>
        <div className="flex flex-col w-fit bg-cinza rounded-e-xl">
          {mesData.map((mes) => (
            <div
              key={mes.mes}
              className="grid grid-cols-4 p-2 gap-2 text-azul-text content-center justify-between self-stretch h-full px-5"
            >
              <div className="text-start">
                <p className="text-base">{mes.mes}</p>
              </div>
              <div className="text-end grid grid-cols-2 justify-end">
                <div className="flex flex-row justify-end">
                  <img
                    className="size-4"
                    src="/icons/desktopmarker.svg"
                    alt="Desktop marker"
                  />
                </div>
                <div className="flex flex-row justify-end">
                  <p className="text-base">{mes.desktop}</p>
                </div>
              </div>
              <div className="text-end grid grid-cols-2 justify-end">
                <div className="flex flex-row justify-end">
                  <img
                    className="size-4"
                    src="/icons/mobilemarker.svg"
                    alt="Mobile marker"
                  />
                </div>
                <div className="flex flex-row justify-end">
                  <p className="text-base">{mes.mobile}</p>
                </div>
              </div>
              <div
                className={`text-center rounded-md justify-center grid grid-cols-2 text-white ${
                  mes.percent > 0
                    ? "bg-red-status"
                    : mes.percent < 0
                    ? "bg-green-500"
                    : "bg-azul-principal"
                }`}
              >
                <div>
                  <p className="text-base">{mes.percent}%</p>
                </div>
                <div className="flex flex-row justify-center items-center">
                  <img
                    src="/icons/arrowWhite.svg"
                    className={`size-4 ${
                      mes.percent < 0
                        ? "rotate-180"
                        : mes.percent === 0
                        ? "-rotate-90"
                        : ""
                    }`}
                    alt="Arrow"
                  />
                </div>
              </div>
            </div>
          ))}
          <hr />
        </div>
      </div>
    </div>
  );
};

// Component for Total Lockdowns
function TotalLockdowns() {
  const lockdowns = [
    { count: 462, percentage: "+23%" },
    { count: 462, percentage: "+23%" }, // Duplicate data for mobile view
  ];

  return (
    <section className="mt-8 flex flex-col justify-self-center gap-5">
      <h3 className="text-start text-sm text-azul-cinza-escuro">
        Bloqueios totais
      </h3>
      {lockdowns.map((lockdown, index) => (
        <LockdownCard key={index} lockdown={lockdown} />
      ))}
    </section>
  );
}

// Component for individual Lockdown Card
function LockdownCard({ lockdown }) {
  return (
    <section className="flex flex-row md:hidden gap-5 justify-between items-center bg-block-MBG w-fit justify-self-center rounded-lg">
      <img src="./icons/rectangle.svg" alt="Lockdown Icon" />
      <p className="text-3xl font-bold text-azul-cinza-escuro">
        {lockdown.count}
      </p>
      <p className="text-azul-MBT text-sm text-wrap">
        Bloqueios totais <br />
        <span className="text-laranja-s">{lockdown.percentage}</span> este mês
      </p>
      <div className="bg-white flex flex-col h-full justify-center items-center w-fit p-3">
        <img className="size-8" src="./icons/arrowUL.svg" alt="Arrow Up" />
        <img className="size-8" src="./icons/arrowDC.svg" alt="Arrow Down" />
      </div>
    </section>
  );
}

// Component for Recent Activity
function RecentActivity() {
  return (
    <div className="hidden bg-azul-principal rounded-xl h-max">
      <div className="flex flex-row justify-between p-3">
        <p className="text-white text-base p-3 text-center">
          Atividade recente
        </p>
        <ActivityFilter />
      </div>
      <ActivityList />
    </div>
  );
}

// Component for Activity Filter
function ActivityFilter() {
  return (
    <select className="bg-azul-principal cursor-pointer hover:brightness-75 duration-300 text-white text-base border-white border">
      <option value="Mes">Este Mês</option>
      <option value="Hoje">Hoje</option>
      <option value="Semana">Esta Semana</option>
    </select>
  );
}

// Component for Activity List
function ActivityList() {
  const activities = [
    {
      text: "Novo bloqueio realizado automaticamente pelo sistema",
      date: "22/03/24",
      icon: "/icons/bloqueio-blue.svg",
    },
    {
      text: "Novo dispositivo desktop cadastrado",
      date: "22/03/24",
      icon: "/icons/PC-blue.svg",
    },
    {
      text: "Nova exceção adicionada manualmente",
      date: "21/03/24",
      icon: "/icons/plus-blue.svg",
    },
    {
      text: "Novo dispositivo móvel cadastrado",
      date: "20/03/24",
      icon: "/icons/Celular-blue.svg",
    },
    {
      text: "Novo usuário criado pelo administrador",
      date: "17/03/24",
      icon: "/icons/user-blue.svg",
    },
  ];

  return (
    <div className="bg-white h-max rounded-b-xl lg:gap-5">
      {activities.map((activity, index) => (
        <ActivityItem key={index} activity={activity} />
      ))}
    </div>
  );
}

// Component for individual Activity Item
function ActivityItem({ activity }) {
  return (
    <div className="flex flex-row justify-between p-3 items-center">
      <div className="flex flex-row justify-start items-center gap-5">
        <div className="border-2 border-azul-principal rounded-full p-2">
          <img src={activity.icon} className="size-5" alt="Activity Icon" />
        </div>
        <p className="text-sm text-azul-text">{activity.text}</p>
      </div>
      <p className="text-sm text-azul-text">{activity.date}</p>
    </div>
  );
}

// Component for General Lockdowns Overview
function GeneralLockdowns() {
  return (
    <div className="hidden bg-azul-principal rounded-xl h-max">
      <div className="flex flex-row justify-between p-3">
        <p className="text-white text-base p-3 text-center">
          Visão Geral de Bloqueios
        </p>
      </div>
      <LockdownOverview />
    </div>
  );
}

// Component for Lockdown Overview
function LockdownOverview() {
  return (
    <div className="bg-gradient-to-l h-full flex flex-row rounded-b-xl to-azul-gradiente-inicio from-azul-gradiente-final">
      {/* Example statistics */}
      <LockdownStatistics count={462} change="+23%" period="Neste Mês" />
      <div className="flex flex-col justify-center mx-auto gap-5">
        <StatisticDisplay month="maio" count={381} />
        <StatisticDisplay month="abril" count={428} />
      </div>
    </div>
  );
}

// Component for individual Lockdown Statistics
function LockdownStatistics({ count, change, period }) {
  return (
    <div className="bg-white h-full rounded-b-xl gap-5 gap-x-10 flex flex-row p-5">
      <img src="./icons/Rectangle.svg" alt="Lockdown Icon" />
      <div className="flex flex-col gap-3 items-center self-center">
        <div className="flex flex-row gap-2">
          <p className="text-4xl text-azul-text">{count}</p>
          <p className="text-azul-text text-base">
            Bloq. <br /> totais
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <p className="text-red-500">{change}</p>
          <p className="text-azul-text text-base">{period}</p>
        </div>
      </div>
      <hr />
      <img src="./icons/Rectangle.svg" alt="Lockdown Icon" />
    </div>
  );
}

// Component for Statistic Display
function StatisticDisplay({ month, count }) {
  return (
    <div className="text-center flex- flex-row justify-center">
      <p className="text-4xl text-white px-5">
        {count} <span className="text-base">em {month}</span>
      </p>
    </div>
  );
}

// Component for Right Dashboard Section
function RightDashboard() {
  return (
    <section className="flex flex-col px-10 gap-1">
      {/* Incidence Graph Placeholder */}
      <div className="bg-azul-principal h-80 rounded-xl p-5 flex flex-col justify-center items-center">
        <p className="text-white">Gráfico de Incidência (Placeholder)</p>
      </div>

      {/* Future Features Placeholder */}
      <div className="bg-azul-principal rounded-xl p-5 mt-5 h-80">
        <p className="text-white">Futuras Funcionalidades (Placeholder)</p>
      </div>
    </section>
  );
}
