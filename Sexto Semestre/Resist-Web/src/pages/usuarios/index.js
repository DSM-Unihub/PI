import FooterContent from "../../components/FooterContent";
import HeaderBar from "../../components/headerBar/HeaderBar";
import NavBar from "../../components/navBar/NavBar";
import { useEffect, useState } from "react";
import axios from "axios";
import url from "@/services/url";
import { useRouter } from "next/router";
import Head from "next/head";
import CardInfo from "@/components/card/card";
import styles from './style.module.css'
const Usuarios = () => {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [isMounted, setIsMounted] = useState(false);



  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(`${url}/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching bloqueios:", error);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  });



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
        <title>Usuarios</title>
      </Head>
      <section className={styles.body}>
        <NavBar />
        <section className={styles.conteudoCentral}>
          <section className={styles.conteudo}>
            <HeaderBar usuario={usuario} />
            <CardInfo titulo={"Gerenciamento de Usuários"} subtitulo={"Administração das permissões e cadastro de perfis secundários."} />
            <section style={{ width: '100%' }}>
            </section>
            <section className={styles.conteudoCentraluser}>
              {users.map((user) => (
                <div key={user._id} className={styles.userCard}>
                  <div className={styles.userImageWrapper}>
                    <img

                      src={user.foto || "/imgs/defaultUser.png"}
                      className={styles.userImage}
                    />
                  </div>
                  <div className={styles.userInfo}>
                    <div className={styles.edit}>
                    <p className={styles.userName}>{user.nome}</p>
                    <p>Icon</p>
                    </div>
                    <div className={styles.userDetails}>
                      <div className={styles.detailRow}>
                        <img alt="Cargo" src="/icons/cargo.svg" className={styles.iconSm} />
                        <p className={styles.detailText}>
                          {user.permissoes}
                        </p>
                      </div>
                      <div className={styles.detailRow}>
                        <img alt="Email" src="/icons/mail.svg" className={styles.iconSm} />
                        <p className={styles.detailText}>{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            <section className={styles.actionsSection}>

              <a href="/novoUser" className={styles.newUserButton}>
                <p className={styles.newUserText}>Novo usuário</p>
                <img alt="Novo usuário" src="/icons/plus-white.svg" className={styles.iconMd} />
              </a>
            </section>
          </section>
        </section>
      </section>
      <FooterContent />
    </>
  );
};

export default Usuarios;
