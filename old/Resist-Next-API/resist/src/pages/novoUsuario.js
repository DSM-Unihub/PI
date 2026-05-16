import FooterContent from "../components/FooterContent";
import HeaderBar from "../components/HeaderBar";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import axios from "axios";
import url from "@/services/url";
import { useRouter } from "next/router";
import Head from "next/head";
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
        <title>Cadastro Usuarios</title>
      </Head>
      <section className="container-principal">
        <NavBar />
        <section className="main-container">
          <HeaderBar usuario={usuario} />
          <section className="flex  px-5 mt-5 gap-1  relative">
            <div className="bg-gradient-to-r from-laranja-s h-fit to-laranja-e p-5 rounded-xl">
              <p className="text-2xl lg:text-4xl text-white">
                Adicionar Usuário
              </p>
              <p className="text-lg lg:text-2xl text-white">
                Crie ou edite usuários do sistema
              </p>
            </div>
          </section>
          <section className="relative flex bg-white flex-col md:flex-row flex-wrap mt-5 px-5 max-w-md">
            <form className="grid grid-cols-2">
                <div className="flex flex-col md:grid grid-cols-2">
                <input placeholder="Nome"/>
                <input placeholder="Email"/>
                <input placeholder="Telefone"/>
                <input placeholder="Instituicao"/>
                <input placeholder="CNPJ"/>
                <input placeholder="Conexao"/>
                <input placeholder="Senha"/>
                </div>
                <div className="flex flex-col">
                <input placeholder="Permissão"/>
                </div>
            </form>
            <section className="flex flex-row justify-end p-5 gap-4 content-end bottom-0 right-0 relative">
              <button className="bg-azul-principal cursor-pointer hover:scale-105 duration-300 rounded-lg p-3 text-white text-base">
                Criar Usuário
              </button>
            </section>
          </section>
        </section>
      </section>
      <FooterContent />
    </>
  );
};

export default NewUSer;
