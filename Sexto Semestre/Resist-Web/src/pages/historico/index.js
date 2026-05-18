import { useState, useEffect } from "react";
import BlockList from "../../components/blockList/BlockList";
import FooterContent from "../../components/FooterContent";
import HeaderBar from "../../components/headerBar/HeaderBar";
import NavBar from "../../components/navBar/NavBar";
import axios from "axios";
import url from "../../services/url"; // Supondo que o url seja o serviço para a API
import { useRouter } from "next/router";
import Head from "next/head";
import ListHistorico from "@/components/listHistorico/listHistorico";
import ListSujestao from "../../components/listaSugestao/ListaSugestao";
import CardInfo from "@/components/card/card";
import styles from './sugestao.module.css'
const Bloqueios = () => {
  const [urlInput, setUrlInput] = useState("");
  const [termoInput, setTermoInput] = useState("");
  const [periodoInput, setPeriodoInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      try {
        const response = await axios.get(`${url}/bloqueios`);
        // Processar a resposta
      } catch (error) {
        console.error("Erro ao buscar bloqueios:", error);
      }
    };

    fetchData();
  }, []);


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
        <title>Sugestões</title>
      </Head>
      <section className={styles.body}>
        <NavBar />
        <section className={styles.conteudoCentral}>
          <section className={styles.conteudo}>
            <section className={styles.cem}>
            <HeaderBar usuario={usuario} />
            <CardInfo titulo={"Histórico"} subtitulo={"Encontre aqui as ações de bloqueio e desbloqueio feitas pelos usuários."} tipo={"Desktop"} sitPessoa={"Caio E. Bronescheki..."} dia={9} mes={"Out"} ano={2025} view={true} />
            < ListHistorico />
            </section>
          </section>
        </section>
      </section>
      <FooterContent />
    </>
  );
};

export default Bloqueios;
