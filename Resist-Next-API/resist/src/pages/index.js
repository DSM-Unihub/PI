import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head.js";
import NavBar from "../components/NavBar.js";
import HeaderBar from "@/components/HeaderBar.js";
import Incidencia from "../components/Incidencia.js";
import Lockdown from "../components/Lockdown.js";
import ActiveDevices from "../components/ActiveDevices.js";
import Calendar from "react-calendar";
import FooterContent from "../components/FooterContent.js";
import RecentActivity from "../components/RecentActivity.js";

export default function Home() {
  const [value, onChange] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();

  // Verificar autenticação e carregar usuário
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      const user = JSON.parse(localStorage.getItem("usuario"));
      setUsuario(user);
    }
    setIsMounted(true); // Marcar como montado
  }, [router]);

  // Mostrar um carregamento enquanto verifica autenticação
  if (!isMounted) {
    return <p>Carregando...</p>;
  }

  // Redirecionar caso o usuário não esteja autenticado
  if (!usuario) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <Head>
        <title>Resist</title>
      </Head>
      <section className="container-principal">
        <NavBar />
        <section className="main-container">
          {/* Passa o usuário para o HeaderBar */}
          <HeaderBar usuario={usuario} />
          <section className="home-container ">
            <div className="dashLeft-container">
              <Welcome usuario={usuario} />
              <RecentActivity />
              <Lockdown />
            </div>
            <div className="dashRight-container">
              <Incidencia />
              <div className="flex flex-col lg:flex-row gap-2 mt-4 ">
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
function Welcome({ usuario }) {
  return (
    <div className="welcomeArea">
      <p className="text-4xl text-white">Olá, {usuario.nome}</p>
      <p className="text-2xl text-white">
        Bem-vindo de volta ao seu dashboard.
      </p>
    </div>
  );
}
