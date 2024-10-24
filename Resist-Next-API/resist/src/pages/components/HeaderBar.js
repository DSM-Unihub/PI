export default function HeaderBar({usuario}) {
  return (
      <div className="header-container">
        <div className="headerBar">
          {/* Pesquisa  */}
          <input
            type="text"
            name="pesquisa"
            placeholder="Pesquisar"
            className="p-1 w-full rounded-lg"
          />
          {/*Icons */}
          <div className="flex flex-row gap-5">
            <div className="headerIcon">
              <img className="size-8" src="/icons/blog.svg" />
            </div>
            <div className="headerIcon">
              <img className="size-8" src="/icons/notificacao.svg" />
            </div>
          </div>
          {/*Perfil */}
          <div className="flex flex-row gap-3 lg:gap-5 text-end">
            <div className=" hidden md:flex">
              <p className="text-azul-text text-xl">{usuario.nome}</p>
              <p className="text-azul-text text-xl">Usuário Business</p>
            </div>
            <div>
              <img
                className=" bg-white size-12 rounded-xl"
                src={usuario.foto}
              />
            </div>
          </div>
        </div>
        {/* Welcome Message for Mobile */}
        <div className="flex md:hidden flex-col text-wrap h-fit p-5">
          <p className="text-2xl text-white">Olá, {usuario.nome}</p>
          <p className="text-lg text-white">
            Bem-vindo de volta ao seu dashboard.
          </p>
        </div>
      </div>
  );
}
