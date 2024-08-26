import {signIn} from "next-auth/react"

export default function Login() {
  return (
    <>
      <section className="flex flex-col lg:grid lg:grid-cols-2 relative">
        {/* Imagem Lateral */}
        <div className="hidden lg:flex relative ">
          <img className=" w-full max-h-screen z-0" src="./imgs/ondas.png" />
        </div>
        <div className="grid grid-flow-row bg-white md:bg-cinza-claro">
          {/* Logo */}
          <div className="hidden md:grid grid-flow-row h-fit justify-end p-4">
            <img className="size-10 " src="./icons/lg-resist-b.svg" />
          </div>
          {/* Div Principal*/}
          <div className="flex flex-col md:grid md:mx-auto md:p-10 gap-3 self-start md:justify-self-center justify-center justify-items-start">
            <h1 className="Urbanist md:flex hidden font-bold text-3xl text-azul-title">
              Bem-Vindo de Volta!
            </h1>
            <h1 className="Urbanist py-10 px-5 md:hidden flex font-bold text-3xl text-azul-principal">
              Bem-Vindo <br /> ao Resist!{" "}
            </h1>
            {/* div Formulario */}
            <div className="md:to-white md:from-white bg-gradient-to-t to-azul-login-inicio from-azul-login-fim rounded-ss-3xl md:rounded-xl grid grid-flow-row p-5 md:p-10 gap-5 md:justify-self-center md:justify-center">
              <p className="text-white md:text-azul-text text-base font-bold md:font-normal md:text-xl">
                Insira seus dados para acessar a sua conta.
              </p>
              {/* Formulario */}
              <div>
                <label className="text-azul-text md:flex hidden text-xl">
                  E-mail
                </label>
                <br />
                <input
                  type="email"
                  name="email"
                  placeholder="Insira seu email"
                  required
                  className="border text-azul-text text-xl border-cinza-border rounded-3xl md:rounded-md h-12 w-full"
                />
                <br />
                <br />
                <label className="text-azul-text md:flex hidden text-xl">
                  Senha
                </label>
                <br />
                <input
                  type="password"
                  name="password"
                  placeholder="Insira sua senha"
                  required
                  minlength="8"
                  className="border text-azul-text text-xl border-cinza-border rounded-3xl md:rounded-md h-12 w-full"
                />
                <br />
                <br />
                <input
                  type="checkbox"
                  checked
                  name="lembrar"
                  classNameName="checked:bg-white "
                />
                <label className="md:text-azul-text text-white text-xl opacity-95 md:opacity-50">
                  Lembrar deste dispositivo{" "}
                </label>
                <br />
                <br />
                <button classNameName="md:bg-azul-principal bg-white md:text-white text-azul-login-fim text-xl text-center w-full rounded-xl p-2"
                >
                  {" "}
                  Entrar
                </button>
              </div>
              <p className="text-center text-white md:text-azul-text">
                Esqueceu sua senha?{" "}
                <a href="#">
                  Clique <span className="font-bold">aqui</span>
                </a>
              </p>
              <div className="grid grid-flow-col text-center justify-center items-center">
                <hr className="w-32 " />
                &nbsp;&nbsp;<p>OU</p>&nbsp;&nbsp;
                <hr className="w-32" />
              </div>
              <a
                href="/cadastro"
                className="text-center text-white md:text-azul-text font-bold text-lg"
              >
                Cadastre-se
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}