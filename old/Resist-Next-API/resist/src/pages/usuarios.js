import FooterContent from "../components/FooterContent";
import HeaderBar from "../components/HeaderBar";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import axios from "axios";
import url from "@/services/url";
import { useRouter } from "next/router";
import Head from "next/head";
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
      <section className="container-principal">
        <NavBar />
        <section className="main-container">
           <HeaderBar usuario={usuario} />
          <section className="flex  px-5 mt-5 gap-1  relative">
            <div className="bg-gradient-to-r from-laranja-s h-fit to-laranja-e p-5 rounded-xl">
              <p className="text-2xl lg:text-4xl text-white">Gerenciamento de Usuários</p>
              <p className="text-lg lg:text-2xl text-white">
                Administração das permissões e cadastro de perfis secundários.
              </p>
            </div>
          </section>
          <section className="flex flex-col md:flex-row mt-5 px-5 flex-wrap gap-5">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white grid grid-cols-2 p-1 md:p-3 justify-items-center w-full gap-1 md:gap-2 rounded-xl max-w-md"
              >
              <div className="flex flex-col justify-center">
                  <img
                    alt={user.nome}
                    src={user.foto || "/imgs/defaultUser.png"} // Exibe imagem do usuário ou uma padrão
                    className="rounded-full border-4 size-24 md:size-32 border-cinza-border"
                  />
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <p className="text-azul-text text-lg">{user.nome}</p>
                  <div className="flex flex-col items-start gap-1">
                    <div className="flex flex-row gap-2 flex-nowrap">
                      <img alt="Cargo" src="/icons/cargo.svg" className="size-5"/>
                      <p className="text-azul-cinza-claro text-sm text-nowrap">
                        {user.permissoes.join(", ")}{" "}
                        {/* Exibindo permissões ou um valor padrão */}
                      </p>
                    </div>
                    <div className="flex flex-row gap-2 flex-nowrap ">
                      <img alt="Telefone" className="size-5" src="/icons/iconCel.svg" />
                      <p className="text-azul-cinza-claro text-sm text-nowrap">
                        +{user.telefone}
                      </p>
                    </div>
                    <div className="flex flex-row gap-2 flex-nowrap">
                      <img alt="Email" src="/icons/mail.svg" className="size-5" />
                      <p className="text-azul-cinza-claro text-sm">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
          <section className="flex flex-row justify-end p-5 gap-4 content-end bottom-0 right-0 relative">
            <a
              href=""
              className="bg-azul-principal cursor-pointer hover:scale-105 duration-300 rounded-lg p-3"
            >
              <img alt="Editar" src="/icons/edit.svg" className="size-6" />
            </a>
            <a
              href=""
              className="bg-azul-principal cursor-pointer hover:scale-105 duration-300 rounded-lg p-3"
            >
              <img alt="Deletar" src="/icons/delete.svg" className="size-6" />
            </a>
            <a
              href="/novoUsuario"
              className="bg-azul-principal rounded-lg cursor-pointer hover:scale-105 duration-300 p-3 flex flex-row gap-3 items-center"
            >
              <p className="text-white text-lg">Novo usuário</p>
              <img
                alt="Novo usuário"
                src="/icons/plus-white.svg"
                className="size-6"
              />
            </a>
          </section>
        </section>
      </section>
      <FooterContent />
    </>
  );
};

export default Usuarios;
