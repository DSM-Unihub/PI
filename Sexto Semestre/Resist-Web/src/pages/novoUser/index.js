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
  const [nome, setNome] = useState("");
const [sobrenome, setSobrenome] = useState("");
const [instituicao, setInstituicao] = useState("");
const [cnpj, setCNPJ] = useState("");
const [email, setEmail] = useState("");
const [ddd, setDdd] = useState("");
const [telefone, setTelefone] = useState("");
const [senha, setSenha] = useState("");
const [confirmarSenha, setConfirmarSenha] = useState("");
const [permissao, setPermissao] = useState(0);
const [foto, setFoto] = useState(null);
const [isSubmitting, setIsSubmitting] = useState(false);
const criarUsuario = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");

  if (!nome || !email || !senha) {
    alert("Preencha os campos obrigatórios!");
    return;
  }

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem!");
    return;
  }

  setIsSubmitting(true);

  try {

    const formData = new FormData();

    formData.append(
      "nome",
      `${nome} ${sobrenome}`
    );

    formData.append("email", email);

    formData.append("senha", senha);

    formData.append(
      "telefone",
      `+55 ${ddd} ${telefone}`
    );

    formData.append(
      "permissoes",
      permissao
    );

    formData.append(
      "instituicao",
      instituicao
    );

    formData.append(
      "cnpj",
      cnpj
    );

    // adiciona imagem
    if (foto) {
      formData.append("foto", foto);
    }

    const response = await axios.post(
      `${url}/user`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":
            "multipart/form-data",
        },
      }
    );

    if (response.data.success) {

      alert("Usuário criado com sucesso!");

      setNome("");
      setSobrenome("");
      setInstituicao("");
      setCNPJ("");
      setEmail("");
      setDdd("");
      setTelefone("");
      setSenha("");
      setConfirmarSenha("");
      setPermissao(0);
      setFoto(null);

      window.location.reload();
    }

  } catch (error) {

    console.error(
      "Erro ao criar usuário:",
      error
    );

    alert(
      error.response?.data?.message ||
      "Erro ao criar usuário."
    );

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
              {/* <CardInfo titulo={"Detalhes"} subtitulo={"Aqui você encontra os detalhes específicos para cada solicitação."} /> */}
            <CardInfo titulo={"Gerenciamento de Usuários"} subtitulo={"Administração das permissões e cadastro de perfis secundários."} />

              <form className={styles.section} onSubmit={criarUsuario}>
                <div style={{ flex: 3, maxHeight: "100%", minWidth: "70%" }}>
                  <div className={styles.formulario} style={{ height: "100%" }}>

                    <div className={styles.linha2}>
                      <input  style={{ flex: '2' }}
  placeholder="Nome"
  type="text"
  value={nome}
  onChange={(e) => setNome(e.target.value)}/>
                      <input   style={{ flex: '1' }}
  placeholder="Sobrenome"
  type="text"
  value={sobrenome}
  onChange={(e) => setSobrenome(e.target.value)}/>
                    </div>

                    <div className={styles.linha2}>
                      <input   style={{ flex: '1' }}
  placeholder="Instituição"
  type="text"
  value={instituicao}
  onChange={(e) => setInstituicao(e.target.value)}
                      />
                      <input   style={{ flex: '2' }}
  placeholder="CNPJ"
  type="text"
  value={cnpj}
  onChange={(e) => setCNPJ(e.target.value)} />

                    </div>

                    <div className={styles.linha2}>
                      <input   style={{ flex: '2' }}
  placeholder="E-mail"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)} />
                      <div className={styles.phoneDDD}>
                        <input   placeholder="DDD"
  type="text"
  value={ddd}
  onChange={(e) => setDdd(e.target.value)} />
                        <input   placeholder="Telefone"
  type="text"
  value={telefone}
  onChange={(e) => setTelefone(e.target.value)} />
                      </div>
                    </div>

                    <div className={styles.linha2}>
                      <input   style={{ flex: '2' }}
  placeholder="Senha"
  type="password"
  value={senha}
  onChange={(e) => setSenha(e.target.value)} />
                 
                    </div>
                    <div className={styles.linha2}>
                      <input   style={{ flex: '2' }}
  placeholder="Digite a senha novamente"
  type="password"
  value={confirmarSenha}
  onChange={(e) => setConfirmarSenha(e.target.value)} />

                    </div>




<div className={styles.imagem}>
  <label
    htmlFor="fotoPerfil"
    style={{
      cursor: "pointer",
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: "15px",
    }}
  >
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

      {foto && (
        <p>
          Arquivo selecionado: {foto.name}
        </p>
      )}
    </div>
  </label>

  <input
    id="fotoPerfil"
    type="file"
    accept=".png,.jpg,.jpeg"
    style={{ display: "none" }}
    onChange={(e) => {
      const arquivo = e.target.files[0];

      if (!arquivo) return;

      // valida tamanho (10MB)
      if (arquivo.size > 10 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 10MB.");
        return;
      }

      setFoto(arquivo);
    }}
  />
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
                            style={{ flex: "none", minWidth: "unset", borderRadius: '100%' }}
                              className={styles.radioCustom}
  type="radio"
  id="administracao"
  name="situacao"
  checked={permissao === 2}
  onChange={() => setPermissao(2)}


                          />
                          <label htmlFor="aceitar">Administração</label>
                          <label style={{ width: '100%', fontWeight: 'unset' }}>O Administrador do sistema tem acesso total a todas as funções disponíveis do sistema, sendo capaz de criar, alterar ou excluir usuários, adicionar ou excluir bloqueios e exceções do sistema, assim como alterar outras configurações que possam impactar no uso do ReSist. </label>
                        </div>

                        <div className={styles.linha}>
                          <input
                            style={{ flex: "none", minWidth: "unset", borderRadius: '100%' }}
                     className={styles.radioCustom}
  type="radio"
  id="gestao"
  name="situacao"
  checked={permissao === 1}
  onChange={() => setPermissao(1)}

                          />
                          <label htmlFor="recusar">Gestão</label>
                          <label style={{ width: '100%', fontWeight: 'unset' }}>O Administrador do sistema tem acesso total a todas as funções disponíveis do sistema, sendo capaz de criar, alterar ou excluir usuários, adicionar ou excluir bloqueios e exceções do sistema, assim como alterar outras configurações que possam impactar no uso do ReSist. </label>

                        </div>
                        <div className={styles.linha}>
                          <input
                            style={{ flex: "none", minWidth: "unset", borderRadius: '100%' }}
                         className={styles.radioCustom}
  type="radio"
  id="visualizacao"
  name="situacao"
  checked={permissao === 0}
  onChange={() => setPermissao(0)}

                          />
                          <label htmlFor="recusar">Visualização</label>
                          <label style={{ width: '100%', fontWeight: 'unset' }}>O Administrador do sistema tem acesso total a todas as funções disponíveis do sistema, sendo capaz de criar, alterar ou excluir usuários, adicionar ou excluir bloqueios e exceções do sistema, assim como alterar outras configurações que possam impactar no uso do ReSist. </label>

                        </div>
                      </div>
                    </div>
                    <div className={styles.divinput}>
                      <input   className={styles.input}
  type="submit"
  value={isSubmitting ? "Criando..." : "Criar Usuário"}
  disabled={isSubmitting}/>
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
