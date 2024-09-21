export default function login() {
  return (
    <>
      <session className="w-full gap-8 h-screen flex flex-col bg-gradient-to-b from-cinza-gradiente-inicio  to-cinza-gradiente-final">
        <div className="w-full h-72 Background clip-curve p-5">
            <img src="./icons/lg-resist-w.svg" className=" size-7"></img>
        </div>
        <session className="flex flex-col justify-center align-middle gap-5">
        <div className="px-5">
          <h1 className="text-5xl  font-bold text-azul-LMT">Bem Vindo!</h1>
          <p className="text-base text-azul-LMT font-bold">Insira seus dados para acessar a sua conta.</p>
        </div>
        <div className="flex flex-col p-5 gap-3 h-full">
            <form className="flex flex-col gap-6">
                <input className=" rounded-3xl p-4 text-lg shadow-md" type="text" placeholder="E-mail"></input>
                <input className=" rounded-3xl p-4 text-lg shadow-md" type="password" placeholder="Senha"></input>
                <button className="bg-azul-principal text-lg p-2 rounded-full text-white mt-10 font-bold">Entrar</button>
            </form>
            <div className="flex h-fit flex-row justify-around border-2 border-azul-principal rounded-full">
                <div className="bg-azul-principal h-fit m-1 w-full p-1 text-center rounded-full"><p className="text-white text-lg font-bold">Login</p></div>
                <div className="m-1 h-fit w-full p-1 text-center rounded-full"><p className="text-cinza-CM font-bold text-lg">Cadastro</p></div>
            </div>
        </div>
        </session>
      </session>
    </>
  );
}
