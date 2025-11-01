import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import url from "../services/url";
import Head from "next/head";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event, email, password) => {
    event.preventDefault();
  
    // Validação básica
    if (!email || !password) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
  
    try {
      const response = await axios.post(`${url}/login`, {
        email,
        senha: password,
      });
  
      const { token, user } = response.data;
  
      // Armazena o token
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(user));  // Armazenando o objeto usuário

  
      // Redireciona o usuário
      router.push("/");
    } catch (error) {
      console.error("Erro no login:", error.response?.data || error.message);
      alert("Erro ao fazer login. Verifique suas credenciais.");
    }
  };
  

  return (
    <>
    <Head>
    <title>login</title>
    </Head>
      <section className="container-login">
        {/* Component for the login image */}
        <div className="login-image">
          <img
            src="./icons/lg-resist-w.svg"
            className="resist-logo"
            alt="Login Illustration"
          />
        </div>

        {/* Component for the login form and related elements */}
        <section className="login-form-container">
          <div className="flex flex-col gap-3 h-fit">
            {/* Component for welcome message */}
            <div className="px-5">
              <h1 className="flex text-5xl font-bold text-azul-LMT md:text-3xl md:text-azul-title">
                Bem Vindo!
              </h1>
              <p className="md:hidden flex text-base text-azul-LMT font-bold">
                Insira seus dados para acessar a sua conta.
              </p>
            </div>

            {/* Component for desktop login form */}
            <div className="hidden bg-white rounded-xl md:grid grid-flow-row p-8 gap-5">
              <p className="text-azul-text font-normal text-xl">
                Insira seus dados para acessar a sua conta.
              </p>
              <form
                method="post"
                onSubmit={(e) => handleSubmit(e, email, password)}
                className="flex flex-col gap-4"
              >
                <input
                  label="E-mail"
                  type="email"
                  className=" border-2 rounded-lg p-2 "
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Insira seu email"
                />
                <input
                  label="Senha"
                  type="password"
                  name="password"
                  className="border-2 rounded-lg p-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Insira sua senha"
                  required
                />
                {/* Component for the remember me checkbox */}
                <div className="flex flex-row items-baseline gap-3">
                  <input
                    type="checkbox"
                    checked
                    name="lembrar"
                    className="checked:bg-white"
                  />
                  <label className="md:text-azul-text text-white text-xl opacity-95 md:opacity-50">
                    Lembrar deste dispositivo
                  </label>
                </div>
                {/* Component for the submit button */}
                <button
                  type="submit"
                  className="md:bg-azul-principal bg-white md:text-white text-azul-login-fim text-xl text-center w-full rounded-xl p-2"
                >
                  Entrar
                </button>
              </form>

              {/* Component for forgot password link */}
              <p className="text-center text-azul-text">
                Esqueceu sua senha?
                <a href="#">
                  Clique <span className="font-bold">aqui</span>
                </a>
              </p>
              {/* Component for divider with "OR" */}
              <div className="grid grid-flow-col text-center justify-center items-center">
                <hr className="w-32" />
                &nbsp;&nbsp;<p>OU</p>&nbsp;&nbsp;
                <hr className="w-32" />
              </div>

              {/* Component for the register link */}
              <a
                href="/cadastro"
                className="text-center text-azul-text font-bold text-lg"
              >
                Cadastre-se
              </a>
            </div>

            {/* Component for mobile login form */}
            <div className="flex md:hidden flex-col p-5">
              <form
                className="flex flex-col gap-6"
                method="post"
                onSubmit={(e) => handleSubmit(e, email, password)}
              >
                <input
                  className="rounded-3xl p-4 text-lg shadow-md"
                  type="text"
                  placeholder="E-mail"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  className="rounded-3xl p-4 text-lg shadow-md"
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="bg-azul-principal text-lg p-2 rounded-full text-white font-bold"
                  type="submit"
                >
                  Entrar
                </button>
              </form>
            </div>
          </div>

          {/* Component for mobile actions */}
          <div className="flex md:hidden p-2 flex-col gap-2">

            <div className="flex h-fit flex-row justify-around border-2 border-azul-principal rounded-full">
              <div className="bg-azul-principal h-fit m-1 w-full p-1 text-center rounded-full">
                <p className="text-white text-lg font-bold">Login</p>
              </div>
              <div className="m-1 h-fit w-full p-1 text-center rounded-full">
                <p className="text-cinza-CM font-bold text-lg">Cadastro</p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

