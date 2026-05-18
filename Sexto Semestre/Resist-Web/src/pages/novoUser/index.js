import FooterContent from "../../components/FooterContent";
import HeaderBar from "../../components/headerBar/HeaderBar";
import NavBar from "../../components/navBar/NavBar";
import { useEffect, useState } from "react";
import axios from "axios";
import url from "@/services/url";
import { useRouter } from "next/router";
import Head from "next/head";
import styles from "./style.module.css"
import CardInfo from "@/components/card/card";
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const NewUSer = () => {
  const [newUser, setNewUser] = useState({});
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
        <title>Detalhes</title>
      </Head>
      <section className={styles.body}>
        <NavBar />
        <section className={styles.conteudoCentral}>
          <section className={styles.conteudo}>
            <HeaderBar usuario={usuario} />
            <section className={styles.contiCenter}>
              <CardInfo titulo={"Detalhes"} subtitulo={"Aqui você encontra os detalhes específicos para cada solicitação."} />

              <form className={styles.section} >
                <div style={{ flex: 3, maxHeight: "100%", minWidth: "70%" }}>
                  <div className={styles.formulario} style={{ height: "100%" }}>

                    <div className={styles.linha2}>
                      <input style={{ flex: '2' }} placeholder="Nome" type="text" id="nome" />
                      <input style={{ flex: '1' }} placeholder="Sobrenome" type="text" id="nome" />
                    </div>

                    <div className={styles.linha2}>
                      <input style={{ flex: '1' }} placeholder="Departamento" type="text" id="dataHora"
                      />
                      <input style={{ flex: '2' }} placeholder="Função" type="text" id="dataHora"
                      />

                    </div>

                    <div className={styles.linha2}>
                      <input style={{ flex: '2' }} placeholder="E-mail" type="text" id="telefone" />
                      <div className={styles.phoneDDD}>
                        <input placeholder="DDD" type="text" id="telefone" />
                        <input placeholder="Telefone" type="text" id="telefone" />
                      </div>
                    </div>

                    <div className={styles.linha2}>
                      <input style={{ flex: '2' }} placeholder="Senha" id="mensagem" rows="3" />
                      <div className={styles.phoneDDD}>
                        <input placeholder="DDD" type="text" id="telefone" />
                        <input placeholder="Telefone" type="text" id="telefone" />
                      </div>
                    </div>
                    <div className={styles.linha2}>
                      <input style={{ flex: '2' }} placeholder="Digite a senha novamente" id="mensagem" rows="3" />

                    </div>




                    <div className={styles.imagem}>
                      <ArrowDownTrayIcon className={styles.ico} />
                      <div>
                        <h3>
                          Faça upload da sua foto de perfil
                        </h3>
                        <p>
                          Formatos aceitos: PNG, JPG, JPEG.
                        </p>
                        <p>
                          Máximo de 10Mb.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ flex: 1, maxHeight: "100%", minWidth: "26.5%" }}>
                  <div style={{ maxHeight: "100%", minWidth: "85%" }}>
                    <div className={styles.formulario} >

                      <div className={styles.linha} >
                        <label style={{ width: "100%" }} htmlFor="nome">Permissões do usuário</label>
                      </div>
                    </div>
                    <div className={styles.formulario} style={{ marginBottom: '25px' }}>
                      <div className={styles.linha} >
                        <div className={styles.linha}>
                          <input
                            className={styles.radioCustom}
                            style={{ flex: "none", minWidth: "unset", borderRadius: '100%' }}
                            type="radio"
                            id="aceitar"
                            name="situacao"
                            value="Aceito"


                          />
                          <label htmlFor="aceitar">Administração</label>
                          <label style={{ width: '100%', fontWeight: 'unset' }}>O Administrador do sistema tem acesso total a todas as funções disponíveis do sistema, sendo capaz de criar, alterar ou excluir usuários, adicionar ou excluir bloqueios e exceções do sistema, assim como alterar outras configurações que possam impactar no uso do ReSist. </label>
                        </div>

                        <div className={styles.linha}>
                          <input
                            style={{ flex: "none", minWidth: "unset", borderRadius: '100%' }}
                            className={styles.radioCustom}
                            type="radio"
                            id="recusar"
                            name="situacao"
                            value="Recusado"

                          />
                          <label htmlFor="recusar">Gestão</label>
                          <label style={{ width: '100%', fontWeight: 'unset' }}>O Administrador do sistema tem acesso total a todas as funções disponíveis do sistema, sendo capaz de criar, alterar ou excluir usuários, adicionar ou excluir bloqueios e exceções do sistema, assim como alterar outras configurações que possam impactar no uso do ReSist. </label>

                        </div>
                        <div className={styles.linha}>
                          <input
                            style={{ flex: "none", minWidth: "unset", borderRadius: '100%' }}
                            className={styles.radioCustom}
                            type="radio"
                            id="recusar"
                            name="situacao"
                            value="Recusado"

                          />
                          <label htmlFor="recusar">Visualização</label>
                          <label style={{ width: '100%', fontWeight: 'unset' }}>O Administrador do sistema tem acesso total a todas as funções disponíveis do sistema, sendo capaz de criar, alterar ou excluir usuários, adicionar ou excluir bloqueios e exceções do sistema, assim como alterar outras configurações que possam impactar no uso do ReSist. </label>

                        </div>
                      </div>
                    </div>
                    <div className={styles.divinput}>
                      <input className={styles.input} type="submit" value="Criar Usuário" />
                    </div>

                  </div>
                </div>
              </form>
            </section>
          </section>
        </section>
      </section>
    </>
  );
};

export default NewUSer;
