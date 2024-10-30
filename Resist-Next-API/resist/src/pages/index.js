import { Inter } from "next/font/google";
import HeaderBar from "./components/HeaderBar.js";
import NavBar from "./components/NavBar.js";
import Incidencia from "./components/Incidencia.js";
import Head from "next/head.js";
import Lockdown from "./components/Lockdown.js";
import ActiveDevices from "./components/ActiveDevices.js";
// Load the Inter font
const inter = Inter({ subsets: ["latin"] });
export default function Home() {
  const usuario = { nome: "Daniel", foto: "./imgs/defaultUser.png" };
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
          <HeaderBar usuario={usuario} />
          <section className="home-container">
            {/* Left Dashboard Section */}
            <div className="dashLeft-container">
              {/* Welcome Section for Desktop */}
              <Welcome usuario={usuario} />

              {/* Recent Activity Section */}
              <RecentActivity />

              {/* Total Lockdowns Section */}
              <Lockdown />
              {/* General Lockdowns Overview */}
              {/* <GeneralLockdowns /> */}
            </div>

            {/* Right Dashboard Section */}
            <div className="dashRight-container">
              <Incidencia />
              <ActiveDevices />
            </div>
          </section>
        </section>
      </section>
    </>
  );
}

// Componente de Bem-Vindo
function Welcome(usuario) {
  return (
    <div className="welcomeArea">
      <p className="text-4xl text-white">Olá, {usuario.nome}</p>
      <p className="text-2xl text-white">
        Bem-vindo de volta ao seu dashboard.
      </p>
    </div>
  );
}

// Component for Recent Activity
function RecentActivity() {
  return (
    <div className="lg:flex flex-col hidden bg-azul-principal rounded-xl h-max">
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
