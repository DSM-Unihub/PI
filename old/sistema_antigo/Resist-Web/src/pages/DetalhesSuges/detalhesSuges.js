import { useState, useEffect } from "react";
import FooterContent from "@/components/FooterContent";
import HeaderBar from "@/components/HeaderBar";
import NavBar from "@/components/NavBar";
import axios from "axios";
import url from "@/services/url"; // Supondo que o url seja o serviço para a API
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "./style.module.css";
import CardInfo from "@/components/card/card";

const DetalhesSujes = () => {
  const formatarData = (dataIso) => {
    const data = new Date(dataIso);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };
  const router = useRouter();
  const { id } = router.query;
  const [sugestao, setSugestao] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [formValues, setFormValues] = useState({
    id: "",
    idUser: "",
    dataHora: "",
    url: "",
    motivo: "",
    tipo: "",
    situacao: "",
    foto: "",
    nome: "",
    email: ""
  })

  useEffect(() => {
    const fetchSugestao = async () => {
      if (id) {
        try {
          const response = await axios.get(`${url}/sugestao/${id}`)
          const selectedSugestao = response.data;
          setSugestao(selectedSugestao);
          setFormValues({
            id: selectedSugestao._id,
            idUser: selectedSugestao.idUser,
            dataHora: selectedSugestao.dataHora,
            url: selectedSugestao.url,
            motivo: selectedSugestao.motivo,
            tipo: selectedSugestao.tipo,
            situacao: selectedSugestao.situacao,
            foto: selectedSugestao.foto,
            nome: selectedSugestao.nome,
            email: selectedSugestao.email
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
    fetchSugestao();
  }, [id]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: type === "radio" ? value === "true" : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = { situacao: formValues.situacao };

    try {
      const response = await axios.put(
        `${url}/sugestao/${id}`,
        updatedData
      );
      if (response.status === 200) {
        alert("Sugestão atualizado!");
        router.push("/sugestao");
      }
    } catch (error) {
      console.error(error);
    }
  };



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
        <title>Detalhes</title>
      </Head>
      <section className="container-principal">
        <NavBar />
        <section className="main-container">
          {/* dashLeft-container */}
          <HeaderBar usuario={usuario} />
          <section className="dashLeft-container">
            <CardInfo
              titulo={"Detalhes"}
              subtitulo={
                "Aqui você encontra os detalhes específicos para cada solicitação."
              }
            />

            <form className={styles.section} onSubmit={handleSubmit}>
              <div style={{ flex: 3, maxHeight: "100%", minWidth: "70%" }}>
                <div className={styles.formulario} style={{ height: "100%" }}>

                  <div className={styles.linha}>
                    <label htmlFor="nome">URL da solicitação:</label>
                    <input type="text" id="nome" value={formValues.url} disabled onChange={handleChange} />
                  </div>

                  <div className={styles.linha}>
                    <label htmlFor="email">Data:</label>
                    <input type="text" id="dataHora" value={formatarData(formValues.dataHora)} disabled onChange={handleChange}
                    />

                  </div>

                  <div className={styles.linha}>
                    <label htmlFor="telefone">Motivo informado:</label>
                    <input type="text" id="telefone" value={formValues.motivo} disabled onChange={handleChange} />
                  </div>

                  <div className={styles.linha}>
                    <label htmlFor="mensagem">Tipo de solicitação:</label>
                    <input id="mensagem" rows="3" value={formValues.tipo} disabled onChange={handleChange} />
                  </div>




                  <div className={styles.imagem}>

                    <img
                      src={formValues.foto || "https://gru.ifsp.edu.br/images/phocagallery/galeria2/thumbs/phoca_thumb_l_image03_grd.png"}
                      className={styles.imagem}
                    />


                    <div>
                      <h3>
                        {formValues.foto}
                      </h3>
                      <p>
                        <span>Download</span> | 8.67mb
                      </p>

                    </div>
                  </div>
                </div>
              </div>

              <div style={{ flex: 1, maxHeight: "100%", minWidth: "26.5%" }}>
                <div style={{ maxHeight: "100%", minWidth: "85%" }}>
                  <div className={styles.formulario} style={{ marginBottom: '25px' }}>

                    <div className={styles.linha} >
                      <label style={{ width: "100%" }} htmlFor="nome">Informações do Solicitante</label>
                      <input type="text" id="nome" value={formValues.nome} disabled />
                      <input type="text" id="email" value={formValues.email} disabled />
                    </div>
                  </div>
                  <div className={styles.formulario} style={{ marginBottom: '25px' }}>
                    <div className={styles.linha} >
                      <label style={{ width: "100%" }} htmlFor="nome">Situação da Solicitação</label>
                      <div className={styles.linha}>
                        <input
                          style={{ flex: "none", minWidth: "unset" }}
                          className={styles.radioCustom}
                          type="radio"
                           id="bloquear" 
                           name="situacao" 
                           value="true" 
                           checked={formValues.situacao === true} 
                           onChange={(e) => setFormValues({ ...formValues, situacao: e.target.value === "true" })}
                        />
                        <label htmlFor="bloquear">Bloquear</label>
                      </div>

                      <div className={styles.linha}>
                        <input style={{ flex: "none", minWidth: "unset" }} className={styles.radioCustom} type="radio" id="desbloquear" name="situacao" checked={formValues.situacao === false} onChange={(e) => setFormValues({ ...formValues, situacao: e.target.value === "true" })} />
                        <label htmlFor="desbloquear">Desbloquear</label>
                      </div>

                    </div>
                  </div>
                  <input className={styles.input} type="submit" value="Salvar" />
                </div>
              </div>
            </form>
          </section>
        </section>
      </section>
      <FooterContent />
    </>
  );
};

export default DetalhesSujes;
