import { useState, useEffect } from "react";
import { useRouter } from "next/router.js";
import Head from "next/head.js";
import NavBar from "../components/NavBar.js";
import HeaderBar from "../components/HeaderBar.js";
import EstatisticasMes from "../components/EstatisticasMes.js";
import FooterContent from "../components/FooterContent.js";
import CardInfo from "@/components/card/card.js";

export default function Estatisticas() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      const user = JSON.parse(localStorage.getItem("usuario"));
      setUsuario(user);
    }
    setIsMounted(true);
  }, [router]);

  // Mostrar uma tela de carregamento enquanto verifica o usuário
  if (!isMounted) {
    return <p>Carregando...</p>;
  }

  // Redirecionar se o usuário não estiver autenticado
  if (!usuario) {
    router.push("/login");
    return null; // Evita renderizar o restante do componente
  }

  return (
    <>
      <Head>
        <title>Estatísticas</title>
      </Head>
      <section className="container-principal">
        {/* Barra de navegação */}
        <NavBar />
        {/* Área principal */}
        <section className="main-container">
          <HeaderBar usuario={usuario} />
          {/* Conteúdo principal */}
          <section className="flex flex-col px-4 gap-1">
            {/*
            <div className="bg-gradient-to-r from-laranja-s h-fit to-laranja-e p-5 rounded-xl max-w-xl">
               <h2 className="lg:text-2xl text-4xl text-white">Estatísticas</h2>
              <p className="lg:text-lg text-2xl text-white">
                Acesso aos dados de bloqueio.
              </p> 
            </div>*/}
            <CardInfo titulo={`Estatísticas`} subtitulo={"Acesso aos dados de bloqueio."} />
            <EstatisticasMes />
          </section>
        </section>
      </section>
      <FooterContent />
    </>
  );
}
