import { useState, useEffect } from "react";
import RedeList from "../../components/listRede/BlockList";
import FooterContent from "../../components/FooterContent";
import HeaderBar from "../../components/headerBar/HeaderBar";
import NavBar from "../../components/navBar/NavBar";
import axios from "axios";
import url from "../../services/url";
import { useRouter } from "next/router";
import Head from "next/head";
import CardInfo from "@/components/card/card";
import styles from './index.module.css'

const Rede = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [quantidadeDispositivos, setQuantidadeDispositivos] = useState(0);
  const [nomeRede, setNomeRede] = useState("");
  const [tipo, setTipo] = useState("");
  const [unidade, setUnidade] = useState("");
  const [dia, setDia] = useState("");
  const [mes, setMes] = useState("");
  const [ano, setAno] = useState("");

  const adicionarRede = async () => {
    const token = localStorage.getItem("token");

    if (!quantidadeDispositivos || quantidadeDispositivos <= 0) {
      alert("Informe a quantidade de dispositivos!");
      return;
    }

    setIsSubmitting(true);

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const lastRes = await axios.get(`${url}/rede`);
      const redes = lastRes.data.data || lastRes.data;
      const lastRede = redes?.[0];
      let baseIp = "192.168.12.0";

      if (lastRede?.ipEnd) {
        baseIp = lastRede.ipEnd;
      }

      const ipToNumber = (ip) =>
        ip.split(".").reduce((acc, oct) => (acc << 8) + Number(oct), 0);

      const numberToIp = (num) => [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255,
      ].join(".");

      const startIpNumber = ipToNumber(baseIp) + 1;
      const endIpNumber = startIpNumber + Number(quantidadeDispositivos) - 1;

      const novoRede = {
        nome: nomeRede || "Rede Automática",
        userId: usuario?.id,
        ipStart: numberToIp(startIpNumber),
        ipEnd: numberToIp(endIpNumber),
        dataHora: new Date().toISOString(),
      };

      const response = await axios.post(`${url}/rede`, novoRede);

      if (response.data.success) {
        alert("Rede criada com sucesso!");
        setQuantidadeDispositivos(0);
        setNomeRede("");
        window.location.reload();
      }
    } catch (error) {
      console.error("Erro ao criar rede:", error.response?.data || error);
      alert(error.response?.data?.message || "Erro ao criar rede");
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (!isMounted) {
    return <p>Carregando...</p>;
  }

  if (!usuario) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <Head>
        <title>Rede</title>
      </Head>
      <section className={styles.body}>
        <NavBar />
        <section className={styles.conteudoCentral}>
          <section className={styles.conteudo}>
            <HeaderBar usuario={usuario} />

            <CardInfo
              titulo={"Rede"}
              subtitulo={"Acesse as faixas de rede da sua unidade."}
              tipo={tipo}
              sitPessoa={unidade}
              dia={dia}
              mes={mes}
              ano={ano}
              tiposList={["Rede Manual", "Rede Automática"]}
              statusList={["Unidade A", "Unidade B", "Unidade C"]}
              onTipoChange={setTipo}
              onSitPessoaChange={setUnidade}
              onDiaChange={setDia}
              onMesChange={setMes}
              onAnoChange={setAno}
              view={true}
            />

            <section className={styles.section}>
              <div style={{ flex: 3, maxHeight: "100%", minWidth: "70%" }}>
                <RedeList tipo={tipo} unidade={unidade} dia={dia} mes={mes} ano={ano}/>
              </div>
              <div style={{ flex: 1, height: "100%", minWidth: "26.5%" }}>
                <div className={styles.container}>
                  <p>Adicionar nova faixa de IPs</p>
                  <div className={styles.formGroup}>
                    <input
                      type="text"
                      placeholder="Nome da rede"
                      className={styles.input}
                      value={nomeRede}
                      onChange={(e) => setNomeRede(e.target.value)}
                    />
                    <input
                      type="number"
                      placeholder="Quantidade de Dispositivos"
                      className={styles.input}
                      value={quantidadeDispositivos}
                      onChange={(e) => setQuantidadeDispositivos(e.target.value)}
                    />
                  </div>
                  <div>
                    <button className={styles.button} onClick={adicionarRede} disabled={isSubmitting}>
                      {isSubmitting ? "Adicionando..." : "Adicionar"}
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

export default Rede;
