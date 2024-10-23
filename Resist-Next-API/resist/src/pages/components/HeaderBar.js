const usuario = {"nome":"Daniel", "foto": "./imgs/defaultUser.png"};

export default function HeaderBar() {
  return (
    <>
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
          <img className=" bg-white size-12 rounded-xl" src={usuario.foto} />
        </div>
      </div>
      </div>
    </>
  );
}
