const usuario = {"nome":"Daniel", "foto": "./imgs/defaultUser.png"};

export default function HeaderBar() {
  return (
    <>
      {/* Pesquisa  */}
      <div className="flex flex-row items-center gap-2 lg:gap-5 w-full max-w-7xl">
      <div className="flex w-full flex-row h-fit">
        <input
          type="text"
          name="pesquisa"
          placeholder="Pesquisar"
          className="p-1 w-full rounded-lg"
        />
      </div>
      {/*Icons */}
      <div className="flex flex-row gap-5">
        <div className="hidden md:flex bg-white border rounded-full w-max h-max p-2">
          <img className="size-8" src="/icons/blog.svg" />
        </div>
        <div className="flex bg-white border rounded-xl md:rounded-full w-max h-max p-2">
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
