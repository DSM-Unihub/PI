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
  const [isLookupLoading, setIsLookupLoading] = useState(false);
  const [existingIndexacaoId, setExistingIndexacaoId] = useState(null);
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [tipo, setTipo] = useState("");
  const [sitPessoa, setSitPessoa] = useState("");
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadIndexacaoByUrl = async (currentUrl) => {
    const trimmedUrl = currentUrl.trim();
    if (!trimmedUrl) {
      setExistingIndexacaoId(null);
      return;
    }
    try {
      setIsLookupLoading(true);
      const response = await axios.get(`${url}/bloqueios/lookup`, {
        params: { url: trimmedUrl },
        headers: getAuthHeaders(),
      });
      const data = response.data?.data;
      setExistingIndexacaoId(data?._id || null);
    } catch {
      setExistingIndexacaoId(null);
    } finally {
      setIsLookupLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadIndexacaoByUrl(urlInput);
    }, 600);
    return () => clearTimeout(timer);
  }, [urlInput]);

  // Bloqueio manual total: se já indexado → PUT; senão → POST (igual ao app mobile)
  const adicionarBloqueioManual = async () => {
    const trimmedUrl = urlInput.trim();
    if (!trimmedUrl) {
      alert("A URL é obrigatória!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Sessão expirada. Faça login novamente.");
      return;
    }

    setIsSubmitting(true);
    const hadExistingIndexacao = Boolean(existingIndexacaoId);

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const motivo = termoInput.trim() || "Bloqueio Manual";
      const periodo = periodoInput.trim() || "Indefinido";
      const bloqueioTotalPayload = {
        url: trimmedUrl,
        urlWeb: trimmedUrl,
        motivo,
        periodo,
        tipoInsercao: "Manual",
        ipMaquina: "192.168.1.1",
        flag: true,
        bloqueioTotal: true,
      };

      let response;
      if (hadExistingIndexacao) {
        response = await axios.put(
          `${url}/bloqueios/${existingIndexacaoId}`,
          {
            url: trimmedUrl,
            motivo,
            periodo,
            flag: true,
            bloqueioTotal: true,
          },
          { headers }
        );
      } else {
        response = await axios.post(
          `${url}/bloqueios`,
          {
            ...bloqueioTotalPayload,
            dataHora: new Date().toISOString(),
          },
          { headers }
        );
      }

      if (response.data?.success !== false) {
        setUrlInput("");
        setTermoInput("");
        setPeriodoInput("");
        setExistingIndexacaoId(null);
        alert(
          hadExistingIndexacao
            ? "Site já indexado — convertido em bloqueio total com sucesso!"
            : "Bloqueio total adicionado com sucesso!"
        );
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
        //console.log(response.data)
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

            <CardInfo
              titulo={"Bloqueios"}
              subtitulo={"Acesso aos dados de bloqueio manuais e automáticos."}
              tipo={tipo}
              sitPessoa={sitPessoa}
              dia={dia}
              mes={mes}
              ano={ano}
              tiposList={["Manual", "Automático"]}
              statusList={[
                { label: "Bloqueado", value: "true" },
                { label: "Desbloqueado", value: "false" },
              ]}
              onTipoChange={setTipo}
              onSitPessoaChange={setSitPessoa}
              onDiaChange={setDia}
              onMesChange={setMes}
              onAnoChange={setAno}
              view={true}
            />

            <section className={styles.section}>
              <div style={{ flex: 3, maxHeight: "100%", minWidth: "70%" }}>
                <BlockList
                  tipo={tipo}
                  sitPessoa={sitPessoa}
                  dia={dia}
                  mes={mes}
                  ano={ano}
                />
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
                    {isLookupLoading && urlInput.trim() && (
                      <p className={styles.lookupHint}>Verificando indexação…</p>
                    )}
                    {!isLookupLoading && existingIndexacaoId && urlInput.trim() && (
                      <p className={styles.lookupHintIndexed}>
                        Site já indexado — ao salvar, será convertido em bloqueio total.
                      </p>
                    )}
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
                      {isSubmitting
                        ? "Salvando..."
                        : existingIndexacaoId
                          ? "Converter em Bloqueio Total"
                          : "Adicionar Bloqueio Manual"}
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
