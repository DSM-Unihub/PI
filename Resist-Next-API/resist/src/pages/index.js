import { Inter } from "next/font/google";
import HeaderBar from "./components/HeaderBar.js";
import NavBar from "./components/NavBar.js";
import Incidencia from "./components/Incidencia.js";
import Head from "next/head.js";
import Lockdown from "./components/Lockdown.js";
import ActiveDevices from "./components/ActiveDevices.js";
import Calendar from "react-calendar";
import { useState, useEffect } from "react";
import FooterContent from "./components/FooterContent.js";
import RecentActivity from "./components/RecentActivity.js";
// Load the Inter font
const inter = Inter({ subsets: ["latin"] });
export default function Home() {
  const [value, onChange] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
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
          <section className="home-container ">
            {/* Left Dashboard Section */}
            <div className="dashLeft-container">
              {/* Welcome Section for Desktop */}
              <Welcome usuario={usuario} />

              {/* Recent Activity Section */}
              <RecentActivity />

              {/* Total Lockdowns Section */}
              <Lockdown />
            </div>

            {/* Right Dashboard Section */}
            <div className="dashRight-container">
              <Incidencia />
              <div className="flex  flex-col lg:flex-row gap-2 mt-4 ">
                <ActiveDevices />
                <div className="flex flex-col self-start text-azul-title text-lg p-5 lg:p-0 ">
                  <h2 className="title">Histórico por data</h2>
                  {isMounted && <Calendar onChange={onChange} value={value} />}
                </div>
              </div>
            </div>
          </section>
        </section>
      </section>
      <FooterContent />
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