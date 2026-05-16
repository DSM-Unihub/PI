import { useState, useEffect } from "react";
import { useRouter } from "next/router.js";
import Head from "next/head.js";
import NavBar from "../../components/navBar/NavBar.js";
import HeaderBar from "../../components/headerBar/HeaderBar.js";
import EstatisticasMes from "../../components/EstatisticasMes.js";
import FooterContent from "../../components/FooterContent.js";
import CardInfo from "@/components/card/card.js";
import GraficoPcMob from "@/components/graficoPcMobile/index.js";
import GraficoEst from  "@/components/graficoEst/index.js";
import styles from './estastisticas.module.css';

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
      <section className={styles.body}>
        <NavBar />
        <section className={styles.conteudoCentral}>
          <section className={styles.conteudo}>
            <section className={styles.cem}>
              <HeaderBar usuario={usuario} />
              <CardInfo titulo={"Estatísticas"} subtitulo={"Acesso aos dados de bloqueio."} />
              <section style={{ display: 'flex', gap: '30px', height: '100%', marginTop:'20px',    flexWrap: 'wrap' }}>
               
                  <GraficoEst />

                  <GraficoPcMob />
        
              </section>

            </section>
          </section>
        </section>
        {/* <FooterContent /> */}
      </section>
    </>
  );
}
