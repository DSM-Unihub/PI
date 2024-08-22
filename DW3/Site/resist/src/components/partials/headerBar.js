export default function Header({ usuario }) {
  return (
    <>
      <section class="flex flex-row items-center justify-between h-fit p-6 md:gap-2 lg:gap-32">
        <div class="flex flex-row items-center gap-2 lg:gap-5 w-full max-w-7xl">
          {/* Pesquisa */}
          <div class="flex w-full flex-row h-fit">
            <input
              type="text"
              name="pesquisa"
              placeholder="Pesquisar"
              class="p-1 w-full rounded-lg"
            />
          </div>
          {/* Icons */}
          <div class="flex flex-row gap-5">
            <div class="flex bg-white border rounded-full w-max h-max p-2">
              <img class="size-8" src="/icons/blog.svg" />
            </div>
            <div class="flex bg-white border rounded-full w-max h-max p-2">
              <img class="size-8" src="/icons/notificacao.svg" />
            </div>
          </div>
          {/* Perfil*/}
          <div class="flex flex-row gap-3 lg:gap-5 text-end">
            <div>
              <p class="text-azul-text text-xl">Daniel</p>
              <p class="text-azul-text text-xl">Usuário Business</p>
            </div>
            <div>
              <img class="size-10 rounded-xl" src="" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
