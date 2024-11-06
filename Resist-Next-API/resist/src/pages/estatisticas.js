import { useEffect } from "react";
import NavBar from "./components/NavBar.js";
import HeaderBar from "./components/HeaderBar.js";
import EstatisticasMes from "./components/EstatisticasMes.js";

export default function Estatisticas() {
 
  const usuario = { nome: "Daniel", foto: "./imgs/defaultUser.png" };

 
  return (
    <section className="container-principal">
        {/* Left Navigation Bar */}
        <nav>
          <NavBar />
        </nav>
        {/* Main Content Area */}
        <section className="main-container">
          <HeaderBar usuario={usuario} />
        <section className="flex flex-col gap-3">
          {/* Dashboard Principal */}
          <section className="grid grid-cols-2 px-4 gap-1">
            <div className="bg-gradient-to-r from-laranja-s h-fit to-laranja-e p-5 rounded-xl">
              <p className="lg:text-3xl text-4xl text-white">Estatísticas</p>
              <p className="lg:text-xl text-2xl text-white">
                Acesso aos dados de bloqueio.
              </p>
            </div>
          </section>
          <section className="flex flex-row px-5 gap-2">
            <EstatisticasMes />
            <div className="flex flex-col px-3 gap-3">
              <h3 className="text-azul-text">Últimos Bloqueios na Rede</h3>
              <div className="flex flex-col bg-white rounded-xl justify-between p-3">
                {/* Dados dos bloqueios */}
                {[...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="Gradient grid grid-flow-col gap-3 w-fit items-center justify-start"
                  >
                    <div className="p-3">
                      <img
                        src={`/icons/bloqBar${
                          index % 2 === 0 ? "Auto" : "Manual"
                        }.svg`}
                        alt="Block"
                      />
                    </div>
                    <div>
                      <img
                        src={`/icons/deskBloq${
                          index % 2 === 0 ? "Auto" : "Manual"
                        }.svg`}
                        alt="Desk Block"
                      />
                    </div>
                    <div>
                      <p className="text-azul-text">
                        Desktop {index + 1}
                        <br />
                        Laboratório {index + 1}
                      </p>
                    </div>
                    <div className="self-end flex flex-col">
                      <p className="text-azul-text ">28/02/2024 14:57</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </section>
      </section>
    </section>
  );
}
