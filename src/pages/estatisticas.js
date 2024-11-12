import { useEffect } from "react";
import NavBar from "./components/NavBar.js";
import HeaderBar from "./components/HeaderBar.js";
import EstatisticasMes from "./components/EstatisticasMes.js";
import FooterContent from "./components/FooterContent.js";

export default function Estatisticas() {
 
  const usuario = { nome: "Daniel", foto: "./imgs/defaultUser.png" };

 
  return (
    <>
    <section className="container-principal ">
        {/* Left Navigation Bar */}
        <nav>
          <NavBar />
        </nav>
        {/* Main Content Area */}
        <section className="main-container ">
          <HeaderBar usuario={usuario} />
        <section className="grid lg:grid-cols-3 gap-1">
          {/* Dashboard Principal */}
          <section className="flex flex-col col-span-2 px-4 gap-1">
            <div className="bg-gradient-to-r from-laranja-s h-fit to-laranja-e p-5 rounded-xl">
              <p className="lg:text-3xl text-4xl text-white">Estatísticas</p>
              <p className="lg:text-xl text-2xl text-white">
                Acesso aos dados de bloqueio.
              </p>
            </div>
            <EstatisticasMes />
          </section>
            <div className="flex flex-col items-center lg:items-start px-2 gap-3">
              <h3 className="text-azul-text">Últimos Bloqueios na Rede</h3>
              <div className="flex flex-col bg-white w-fit rounded-xl px-2">
                {/* Dados dos bloqueios */}
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="Gradient flex flex-row gap-1 w-fit items-center"
                  >
                    <div className="p-2">
                      <img
                      className="size-10"
                        src={`/icons/bloqBar${
                          index % 2 === 0 ? "Auto" : "Manual"
                        }.svg`}
                        alt="Block"
                      />
                    </div>
                    <div>
                      <img
                      className="size-8"
                        src={`/icons/deskBloq${
                          index % 2 === 0 ? "Auto" : "Manual"
                        }.svg`}
                        alt="Desk Block"
                      />
                    </div>
                    <div>
                      <p className="text-azul-text text-base">
                        Desktop {index + 1}
                        <br />
                        Laboratório {index + 1}
                      </p>
                    </div>
                    <div className="self-end flex text-base flex-col">
                      <p className="text-azul-text ">28/02/2024 14:57</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>
      </section>
        <FooterContent />
        </>
  );
}
