export default function HeaderBar({ usuario }) {
  return (
    <>
      {/* Pesquisa */}
      <div className="flex w-full flex-row h-fit">
        <input
          type="text"
          name="pesquisa"
          placeholder="Pesquisar"
          className="p-1 w-full rounded-lg"
        />
      </div>
      {/* Icons */}
      <div className="flex flex-row gap-5">
        <div className="flex bg-white border rounded-full w-max h-max p-2">
          <img className="size-8" src="/icons/blog.svg" />
        </div>
        <div className="flex bg-white border rounded-full w-max h-max p-2">
          <img className="size-8" src="/icons/notificacao.svg" />
        </div>
      </div>
      {/* Perfil*/}
      <div className="flex flex-row gap-3 lg:gap-5 text-end">
        <div>
          <p className="text-azul-text text-xl">Daniel</p>
          <p className="text-azul-text text-xl">Usuário Business</p>
        </div>
        <div>
          <img className="size-10 rounded-xl" src="/imgs/defaultUser.png" />
        </div>
      </div>
    </>
  );
}
