import Image from "next/image";

export default function HeaderBar({ usuario }) {
  return (
    <div className="header-container">
      <div className="headerBar">
        {/* Pesquisa */}
        <input
          type="text"
          name="pesquisa"
          placeholder="Pesquisar"
          className="p-1 w-full max-w-3xl rounded-lg"
        />
        {/* Icons */}
        <div className="flex flex-row gap-5">
          <div className="headerIcon">
            <img alt="" className="size-8" src="/icons/blog.svg" />
          </div>
          <div className="headerIcon">
            <img alt="" className="size-8" src="/icons/notificacao.svg" />
          </div>
        </div>
        {/* Perfil */}
        <div className="flex flex-row gap-3 lg:gap-2 text-end">
          <div className="hidden md:flex">
            <p className="text-azul-text text-xl">
              {usuario?.nome || "Usuário"} | {usuario?.permissoes.join(", ")}
            </p>
          </div>
          <div>
            <img
              alt="Foto de perfil"
              className="bg-white size-12 rounded-xl"
              src={usuario?.foto || "/icons/default-profile.svg"}
            />
          </div>
        </div>
      </div>
      {/* Mensagem de Boas-Vindas para Mobile */}
      <div className="flex md:hidden flex-col text-wrap h-fit p-5">
        <p className="text-2xl text-white">Olá, {usuario?.nome}</p>
        <p className="text-lg text-white">
          Bem-vindo de volta ao seu dashboard.
        </p>
      </div>
    </div>
  );
}
