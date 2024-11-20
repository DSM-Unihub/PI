import FooterContent from "./components/FooterContent";
import HeaderBar from "./components/HeaderBar";
import NavBar from "./components/NavBar";

const usuarios = () => {
  const usuario = { nome: "Daniel", foto: "./imgs/defaultUser.png" };
const users =[
    {
        nome: "Daniel", foto: "./imgs/defaultUser.png" 
    }
]
  return (
    <>
      <section className="container-principal">
        <NavBar />
        <section className="main-container">
          <HeaderBar usuario={usuario} />
          <section class="grid grid-cols-2 px-5 gap-1">
            <div class="bg-gradient-to-r from-laranja-s h-fit to-laranja-e p-5 rounded-xl">
              <p class="text-4xl text-white">Gerenciamento de Usuários</p>
              <p class="text-2xl text-white">
                Administração das permissões e cadastro de perfis secundários.
              </p>
            </div>
          </section>
          <section class=" grid grid-cols-2 px-5">
            {users.map((users) => (
              <div class="bg-white grid grid-cols-2 p-5 justify-items-center w-full gap-3 rounded-xl">
                <div class="flex flex-col justify-center">
                  <img
                    src={users.foto}
                    class="rounded-full border-4 size-28 border-cinza-border "
                  />
                </div>
                <div class="grid grid-flow-row gap-3 w-full">
                  <p class="text-azul-text text-lg">{users.nome}</p>
                  <div class="flex flex-col">
                    <div class="flex flex-row gap-2 flex-nowrap">
                      <img src="/icons/cargo.svg" />
                      <p class="text-azul-cinza-claro text-sm ">
                        {users.nomeGrupo}
                      </p>
                    </div>
                    <div class="flex flex-row gap-2 flex-nowrap">
                      <img src="/icons/mail.svg" />
                      <p class="text-azul-cinza-claro text-sm">{users.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
          <section class="flex flex-row justify-end p-5 gap-4 content-end bottom-0 right-0 absolute">
            <a
              href="/editUser"
              class="bg-azul-principal cursor-pointer hover:scale-105 duration-300 rounded-lg p-3"
            >
              <img src="/icons/edit.svg" class="size-6" />
            </a>
            <a
              href="/deletUser"
              class="bg-azul-principal cursor-pointer hover:scale-105 duration-300 rounded-lg p-3"
            >
              <img src="/icons/delete.svg" class="size-6" />
            </a>
            <a
              href="/newUser"
              class="bg-azul-principal rounded-lg cursor-pointer hover:scale-105 duration-300 p-3 flex flex-row gap-3 items-center"
            >
              <p class="text-white text-lg">Novo usuário</p>
              <img src="/icons/plus-white.svg" class="size-6" />
            </a>
          </section>
        </section>
      </section>
      <FooterContent />
    </>
  );
};
export default usuarios;
