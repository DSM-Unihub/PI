import { useState, useEffect } from "react";
import BlockList from "../../components/blockList/BlockList";
import FooterContent from "../../components/FooterContent";
import HeaderBar from "../../components/headerBar/HeaderBar";
import NavBar from "../../components/navBar/NavBar";
import axios from "axios";
import url from "../../services/url"; // Supondo que o url seja o serviço para a API
import { useRouter } from "next/router";
import Head from "next/head";
import CardInfo from "@/components/card/card";
import styles from './index.module.css'
const Bloqueios = () => {
  const [urlInput, setUrlInput] = useState("");
  const [termoInput, setTermoInput] = useState("");
  const [periodoInput, setPeriodoInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  // Função para adicionar um novo bloqueio manual
  const adicionarBloqueioManual = async () => {
    const token = localStorage.getItem("token"); // Pegue o token armazenado
    if (!urlInput) {
      alert("A URL é obrigatória!");
      return;
    }

    setIsSubmitting(true);

    try {
      const novoBloqueio = {
        url: urlInput,
        urlWeb: urlInput,
        motivo: termoInput || "Bloqueio Manual",
        periodo: periodoInput || "Indefinido",
        tipoInsercao: "Manual",
        ipMaquina: "192.168.1.1",
        dataHora: new Date().toISOString(),
        flag: true,
      };

      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.post(`${url}/bloqueios`, novoBloqueio);

      if (response.data.success) {
        setUrlInput("");
        setTermoInput("");
        setPeriodoInput("");
        alert("Bloqueio adicionado com sucesso!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Erro ao adicionar o bloqueio:", error);
      alert(
        error.response?.data?.error ||
        "Erro ao adicionar o bloqueio. Por favor, tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      try {
        const response = await axios.get(`${url}/bloqueios`);
        console.log(response.data)
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
        <title>Bloqueios</title>
      </Head>
      <section className={styles.body}>
        <NavBar />
        <section className={styles.conteudoCentral}>
          <section className={styles.conteudo}>

            <HeaderBar usuario={usuario} />

            <CardInfo titulo={"Bloqueios"} subtitulo={"Acesso aos dados de bloqueio manuais e automáticos."} tipo={"Desktop"} sitPessoa={"Bloqueio Automático"} dia={9} mes={"Out"} ano={2025} view={true} />

            <section className={styles.section}>
              <div style={{ flex: 3, maxHeight: "100%", minWidth: "70%" }}>
                <BlockList />
              </div>
              <div style={{ flex: 1, height: "100%", minWidth: "26.5%" }}>
                
                <div className={styles.container}>
                  
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      placeholder="URL"
                      className={styles.input}
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Motivo (opcional)"
                      className={styles.input}
                      value={termoInput}
                      onChange={(e) => setTermoInput(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Período (opcional)"
                      className={styles.input}
                      value={periodoInput}
                      onChange={(e) => setPeriodoInput(e.target.value)}
                    />
                  </div>
                  <div>
                    <button
                      className={styles.button}
                      onClick={adicionarBloqueioManual}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Adicionando..." : "Adicionar Bloqueio Manual"}
                    </button>
                  </div>
                </div>
              </div>

            </section>
          </section>
        </section>
      </section>

      <FooterContent />
    </>
  );
};

export default Bloqueios;
