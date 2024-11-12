import BlockList from "./components/BlockList";
import FooterContent from "./components/FooterContent";
import HeaderBar from "./components/HeaderBar";
import NavBar from "./components/NavBar";

const bloqueios = () => {
  const usuario = { nome: "Daniel", foto: "./imgs/defaultUser.png" };
  return (
    <>
      <section className="container-principal ">
        <NavBar />
        <section className="main-container ">
          <HeaderBar usuario={usuario} />
          <section class="flex flex-col gap-5 overflow-hidden">
            {/* Dashboard Principal */}
            <section class="grid grid-cols-2 px-5 gap-1">
              <div class="bg-gradient-to-r from-laranja-s h-fit to-laranja-e p-5 rounded-xl">
                <p class="text-2xl text-white">
                  Acesso aos dados de bloqueio manuais e automáticos.
                </p>
              </div>
            </section>
            <section class="flex flex-row gap-x-5 px-5 max-h-screen">
              <BlockList />
              <div class="flex flex-col w-full">
                <div class="p-3 gap-5">
                  <h3 class="text-azul-text font-bold text-lg">
                    Bloqueio Manual
                  </h3>
                </div>
                <div class="flex flex-col bg-white rounded-xl p-5 max-w-full h-full max-h-100 gap-5 justify-between">
                  <div class="flex flex-col gap-5">
                    <input
                      type="text"
                      placeholder="URL"
                      class="border-2 border-azul-cinza-claro text-azul-text w-full h-fit p-3 rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="Motivo (opcional)"
                      class="border-2 border-azul-cinza-claro text-azul-text w-full h-fit p-3 rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="Período"
                      class="border-2 border-azul-cinza-claro text-azul-text w-full h-fit p-3 rounded-xl"
                    />
                  </div>
                  <div>
                    <button class="text-white bg-azul-buttom w-full h-fit rounded-xl p-3">
                      Adicionar Bloqueio Manual
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </section>
        </section>
      </section>
      <FooterContent />
    </>
  );
};
export default bloqueios;
