export default function login() {
  return (
    <>
      <session className="w-full gap-8 md:gap-0 h-screen flex flex-col md:flex-row md:items-center bg-gradient-to-b from-cinza-gradiente-inicio  to-cinza-gradiente-final">
        <div className="w-full md:w-2/5 lg:w-full h-72 md:h-full Background clip-curve p-5">
          <img
            src="./icons/lg-resist-w.svg"
            className="md:hidden flex size-7"
          ></img>
        </div>
        <session className="flex h-full w-full justify-around flex-col align-middle gap-5 md:p-5 lg:h-fit">
          <div className="flex flex-col gap-3 h-fit">
            <div className="px-5">
              <h1 className="flex md:hidden text-5xl  font-bold text-azul-LMT">
                Bem Vindo!{" "}
              </h1>
              <h1 className="hidden md:flex font-bold text-3xl text-azul-title">
                Bem-vindo de volta!
              </h1>
              <p className="md:hidden flex text-base text-azul-LMT font-bold">
                Insira seus dados para acessar a sua conta.
              </p>
            </div>

            <div className="hidden bg-white rounded-xl md:grid grid-flow-row p-8 gap-5">
              <p className="text-azul-text font-normal text-xl">
                Insira seus dados para acessar a sua conta.
              </p>
              <form
                method="post"
                action="/authenticate"
                className="flex flex-col"
              >
                <label className="text-azul-text md:flex hidden text-xl">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Insira seu email"
                  required
                  className="border text-azul-text text-xl border-cinza-border rounded-md p-2 h-12 w-full"
                />
                <br />
                <label className="text-azul-text md:flex hidden text-xl">
                  Senha
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Insira sua senha"
                  required
                  minlength="8"
                  className="border text-azul-text text-xl border-cinza-border rounded-md h-12 w-full"
                />
                <br/>
                <div className="flex flex-row items-baseline gap-3">
                  <input
                    type="checkbox"
                    checked
                    name="lembrar"
                    className="checked:bg-white "
                  />
                  <label className="md:text-azul-text text-white text-xl opacity-95 md:opacity-50">
                    Lembrar deste dispositivo
                  </label>
                </div>
                <br/>
                <button
                  type="submit"
                  className="md:bg-azul-principal bg-white md:text-white text-azul-login-fim text-xl text-center w-full rounded-xl p-2"
                >
                  Entrar
                </button>
              </form>
              <p className="text-center text-azul-text">
                Esqueceu sua senha?
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
                className="text-center text-azul-text font-bold text-lg"
              >
                Cadastre-se
              </a>
            </div>

            <div className="flex md:hidden flex-col p-5">
              <form className="flex flex-col gap-6">
                <input
                  className=" rounded-3xl p-4 text-lg shadow-md"
                  type="text"
                  placeholder="E-mail"
                ></input>
                <input
                  className=" rounded-3xl p-4 text-lg shadow-md"
                  type="password"
                  placeholder="Senha"
                ></input>
              </form>
            </div>
          </div>
          <div className="flex md:hidden p-2 flex-col gap-2">
            <button className="bg-azul-principal text-lg p-2 rounded-full text-white font-bold">
              Entrar
            </button>
            <div className="flex h-fit flex-row justify-around border-2 border-azul-principal rounded-full">
              <div className="bg-azul-principal h-fit m-1 w-full p-1 text-center rounded-full">
                <p className="text-white text-lg font-bold">Login</p>
              </div>
              <div className="m-1 h-fit w-full p-1 text-center rounded-full">
                <p className="text-cinza-CM font-bold text-lg">Cadastro</p>
              </div>
            </div>
          </div>
        </session>
      </session>
    </>
  );
}
