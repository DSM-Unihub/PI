import { Inter } from "next/font/google";
import HeaderBar from "./partials/headerBar.js";
import NavBar from "./partials/navBar.js";
const inter = Inter({ subsets: ["latin"] });
const usuario = "Daniel";

export default function Home() {
  return (
    <>
      <section className="flex flex-row justify-start h-screen bg-gradient-to-tr from-cinza-secundario to-cinza-principal w-full h-full">
        <section className="hidden md:flex bg-gradient-to-b from-azul-principal to-azul-nav-fim  flex-col p-5 h-screen gap-10">
          <NavBar />
        </section>
        <section className="flex flex-col w-full lg:overflow-hidden">
          <section className="Background gap-10 flex flex-col justify-between p-6 md:gap-2 lg:gap-32 ">
            <HeaderBar />
            <div className="flex md:hidden flex-col text-wrap h-fit p-5">
                <p className="text-2xl text-white">Olá,{usuario}</p>
                <p className="text-lg text-white">
                  Bem-vindo de volta ao seu dashboard.
                </p>
              </div>
          </section>
          <section className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-0">
            {/* Dashboard Principal*/}
            <section className="grid grid-flow-row px-2 lg:px-10 gap-10 lg:gap-1">
              {/* Bem-vindo*/}
              <div className="hidden md:flex flex-col text-wrap bg-gradient-to-r from-laranja-s h-fit to-laranja-e p-5 rounded-xl">
                <p className="text-4xl text-white">Olá,{usuario}</p>
                <p className="text-2xl text-white">
                  Bem-vindo de volta ao seu dashboard.
                </p>
              </div>

              {/* Atividade Recente*/}
              <div className="bg-azul-principal rounded-xl h-max">
                <div className="flex flex-row justify-between p-3">
                  <p className="text-white text-base p-3 text-center">
                    Atividade recente
                  </p>
                  {/* Select Filtro*/}
                  <select className="bg-azul-principal cursor-pointer hover:brightness-75 duration-300 text-white text-base border-white border">
                    <option value="Mes">Este Mês</option>
                    <option value="Mes">Hoje</option>
                    <option value="Mes">Esta Semana</option>
                  </select>
                </div>
                {/* Atividades*/}
                <div className=" bg-white h-max rounded-b-xl lg:gap-5">
                  <div className="flex flex-row justify-between p-3 items-center">
                    <div className="flex flex-row justify-start items-center gap-5">
                      <div className="border-2 border-azul-principal rounded-full p-2 ">
                        <img
                          src="/icons/bloqueio-blue.svg"
                          className="size-5"
                        />
                      </div>
                      <p className="text-sm text-azul-text">
                        Novo bloqueio realizado automaticamente pelo sistema
                      </p>
                    </div>
                    <p className="text-sm text-azul-text">22/03/24</p>
                  </div>
                  <hr />
                  <div className="flex flex-row justify-between p-3 items-center">
                    <div className="flex flex-row justify-start items-center gap-5">
                      <div className="border-2 border-azul-principal rounded-full p-2 ">
                        <img src="/icons/PC-blue.svg" className="size-5" />
                      </div>
                      <p className="text-sm text-azul-text">
                        Novo dispositivo desktop cadastrado
                      </p>
                    </div>
                    <p className="text-sm text-azul-text">22/03/24</p>
                  </div>
                  <hr />
                  <div className="flex flex-row justify-between p-3 items-center">
                    <div className="flex flex-row justify-start items-center gap-5">
                      <div className="border-2 border-azul-principal rounded-full p-2 ">
                        <img src="/icons/plus-blue.svg" className="size-5" />
                      </div>
                      <p className="text-sm text-azul-text">
                        Nova exceção adicionada manualmente
                      </p>
                    </div>
                    <p className="text-sm text-azul-text">21/03/24</p>
                  </div>
                  <hr />
                  <div className="flex flex-row justify-between p-3 items-center">
                    <div className="flex flex-row justify-start items-center gap-5">
                      <div className="border-2 border-azul-principal rounded-full p-2 ">
                        <img src="/icons/Celular-blue.svg" className="size-5" />
                      </div>
                      <p className="text-sm text-azul-text">
                        Novo dispositivo móvel cadastrado
                      </p>
                    </div>
                    <p className="text-sm text-azul-text">20/03/24</p>
                  </div>
                  <hr />
                  <div className="flex flex-row justify-between p-3 items-center">
                    <div className="flex flex-row justify-start items-center gap-5">
                      <div className="border-2 border-azul-principal rounded-full p-2 ">
                        <img src="/icons/user-blue.svg" className="size-5" />
                      </div>
                      <p className="text-sm text-azul-text">
                        Novo usuário criado pelo administrador
                      </p>
                    </div>
                    <p className="text-sm text-azul-text">17/03/24</p>
                  </div>
                  <hr />
                </div>
              </div>

              {/* Bloqueios Gerais*/}
              <div className="bg-azul-principal rounded-xl h-max">
                <div className="flex flex-row justify-between p-3">
                  <p className="text-white text-base p-3 text-center">
                    Visão Geral de Bloqueios
                  </p>
                </div>
                <div className="bg-gradient-to-l h-full flex flex-row rounded-b-xl  to-azul-gradiente-inicio from-azul-gradiente-final">
                  <div className="bg-white h-full rounded-b-xl gap-5 gap-x-10 flex flex-row p-5">
                    <img src="/icons/Rectangle.svg" />
                    <div className="flex flex-col gap-3 items-center self-center">
                      <div className="flex flex-row gap-2">
                        <p className="text-4xl text-azul-text ">462 </p>
                        <p className="text-azul-text text-base">
                          Bloq. <br /> totais
                        </p>
                      </div>
                      <div className="flex flex-row gap-2">
                        <p className="text-red-500">+23%</p>
                        <p className="text-azul-text text-base">Neste Mês</p>
                      </div>
                    </div>
                    <hr />
                    <img src="/icons/Rectangle.svg" />
                    <div className="flex flex-col gap-3 items-center self-center">
                      <div className="flex flex-row gap-2 items-center">
                        <img className=" size-5" src="/icons/arrowup.svg" />
                        <p className="text-4xl text-azul-text ">26% </p>
                      </div>
                      <div className="flex flex-row gap-2">
                        <p className="text-azul-text text-base">
                          Desde o último mês
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center mx-auto gap-5">
                    <div className="text-center flex- flex-row justify-center">
                      <p className="text-4xl text-white px-5">
                        381 <span className="text-base">em maio</span>
                      </p>
                    </div>
                    <hr />
                    <div className="text-center flex- flex-row justify-center">
                      <p className="text-4xl text-white px-5">
                        428 <span className="text-base">em abril</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {/* Dashboard Direito*/}
            <section className="flex flex-col px-10 gap-1">
              {/* Graficos de Incidencia por sala*/}
              <div className="grid grid-flow-row gap-5 flex-nowrap">
                <p className="text-lg text-azul-text">
                  Nível de incidência por sala/laboratório
                </p>
                {/* Graficos*/}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"></div>
              </div>
              {/* Tabelas*/}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <div className="flex flex-col">
                  <p className="text-azul-text text-base">Ativos Agora</p>
                  <div className="flex flex-col rounded-xl bg-white p-3 justify-center items-center text-center">
                    <table className="text-azul-text text-base gap-5">
                      <thead className="font-bold">
                        <tr>
                          <th className="px-3">Nome</th>
                          <th className="px-3">Qtde. Disp.</th>
                          <th className="px-3">Status</th>
                        </tr>
                      </thead>

                      <tbody className="border-b gap-5 hover:bg-slate-200 cursor-pointer">
                        <tr>
                          <td className="px-3">Laboratório 01</td>
                          <td className="px-3">35</td>
                          <td className="px-3 flex flex-row items-center justify-center">
                            <img
                              className="size-5"
                              src="/icons/status-green.svg"
                            />
                          </td>
                        </tr>
                        <tr className="border-b gap-5 hover:bg-slate-200 cursor-pointer">
                          <td className="px-3">Laboratório 02</td>
                          <td className="px-3">34</td>
                          <td className="px-3 flex flex-row items-center justify-center">
                            <img
                              className="size-5"
                              src="/icons/status-green.svg"
                            />
                          </td>
                        </tr>
                        <tr className="border-b gap-5 hover:bg-slate-200 cursor-pointer">
                          <td className="px-3">Laboratório 03</td>
                          <td className="px-3">20</td>
                          <td className="px-3 flex flex-row items-center justify-center">
                            <img
                              className="size-5"
                              src="/icons/status-red.svg"
                            />
                          </td>
                        </tr>
                        <tr className="border-b gap-5 hover:bg-slate-200 cursor-pointer">
                          <td className="px-3">Laboratório 04</td>
                          <td className="px-3">10</td>
                          <td className="px-3 flex flex-row items-center justify-center">
                            <img
                              className="size-5"
                              src="/icons/status-red.svg"
                            />
                          </td>
                        </tr>
                        <tr className="border-b gap-5 hover:bg-slate-200 cursor-pointer">
                          <td className="px-3">Laboratório 05</td>
                          <td className="px-3">16</td>
                          <td className="px-3 flex flex-row items-center justify-center">
                            <img
                              className="size-5"
                              src="/icons/status-green.svg"
                            />
                          </td>
                        </tr>
                        <tr className="border-b gap-5 hover:bg-slate-200 cursor-pointer">
                          <td className="px-3">Laboratório 06</td>
                          <td className="px-3">22</td>
                          <td className="px-3 flex flex-row items-center justify-center">
                            <img
                              className="size-5"
                              src="/icons/status-green.svg"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <img className="size-5" src="/icons/arrowDown.svg" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <p>Histórico por data</p>
                  <div className="flex flex-col rounded-xl bg-white p-3 justify-between items-center text-center w-full h-max">
                    <div className="flex flex-row w-full items-center justify-evenly">
                      <img
                        className="cursor-pointer hover:scale-105 duration-300 size-4 rotate-90"
                        src="/icons/arrowDown.svg"
                      />
                      <p className="text-azul-text text-base font-bold">
                        Fevereiro
                      </p>
                      <img
                        className="cursor-pointer hover:scale-105 duration-300 size-4 -rotate-90"
                        src="/icons/arrowDown.svg"
                      />
                    </div>
                    <div className="flex flex-col w-full h-full ">
                      <table className="text-azul-text text-base w-full h-full flex flex-col">
                        <thead className="font-bold ">
                          <tr>
                            <th className=" px-5 hover:bg-slate-200">D</th>
                            <th className=" px-5 hover:bg-slate-200">S</th>
                            <th className=" px-5 hover:bg-slate-200">T</th>
                            <th className=" px-5 hover:bg-slate-200">Q</th>
                            <th className=" px-5 hover:bg-slate-200">Q</th>
                            <th className=" px-5 hover:bg-slate-200">S</th>
                            <th className=" px-5 hover:bg-slate-200">S</th>
                          </tr>
                        </thead>
                        <tbody className="border-b  cursor-pointer">
                          <tr>
                            <td className="py-1 px-5opacity-75 hover:bg-slate-200">
                              28
                            </td>
                            <td className="py-1 px-5opacity-75 hover:bg-slate-200">
                              29
                            </td>
                            <td className="py-1 px-5opacity-75 hover:bg-slate-200">
                              30
                            </td>
                            <td className="py-1 px-5opacity-75 hover:bg-slate-200">
                              31
                            </td>
                            <td className="py-1 px-5 bg-azul-principal text-white">
                              01
                            </td>
                            <td className="py-1 px-5hover:bg-slate-200">02</td>
                            <td className="py-1 px-5hover:bg-slate-200">03</td>
                          </tr>
                          <tr className="border-b  cursor-pointer">
                            <td className="py-1 px-5hover:bg-slate-200">04</td>
                            <td className="py-1 px-5 bg-azul-principal text-white">
                              05
                            </td>
                            <td className="py-1 px-5hover:bg-slate-200">06</td>
                            <td className="py-1 px-5 bg-azul-principal text-white">
                              07
                            </td>
                            <td className="py-1 px-5 bg-azul-principal text-white">
                              08
                            </td>
                            <td className="py-1 px-5hover:bg-slate-200">09</td>
                            <td className="py-1 px-5hover:bg-slate-200">10</td>
                          </tr>
                          <tr className="border-b  cursor-pointer">
                            <td className="py-1 px-5hover:bg-slate-200">11</td>
                            <td className="py-1 px-5hover:bg-slate-200">12</td>
                            <td className="py-1 px-5 bg-azul-principal text-white">
                              13
                            </td>
                            <td className="py-1 px-5 bg-azul-principal text-white">
                              14
                            </td>
                            <td className="py-1 px-5hover:bg-slate-200">15</td>
                            <td className="py-1 px-5hover:bg-slate-200">16</td>
                            <td className="py-1 px-5 bg-azul-principal text-white">
                              17
                            </td>
                          </tr>
                          <tr className="border-b  cursor-pointer">
                            <td className="py-1 px-5hover:bg-slate-200">18</td>
                            <td className="py-1 px-5 bg-azul-principal text-white">
                              19
                            </td>
                            <td className="py-1 px-5hover:bg-slate-200">20</td>
                            <td className="py-1 px-5hover:bg-slate-200">21</td>
                            <td className="py-1 px-5hover:bg-slate-200">22</td>
                            <td className="py-1 px-5 bg-azul-principal text-white">
                              23
                            </td>
                            <td className="py-1 px-5hover:bg-slate-200">24</td>
                          </tr>
                          <tr className="border-b  cursor-pointer">
                            <td className="py-1 px-5hover:bg-slate-200 ">25</td>
                            <td className="py-1 px-5hover:bg-slate-200">26</td>
                            <td className="py-1 px-5hover:bg-slate-200">27</td>
                            <td className="py-1 px-5 bg-azul-principal text-white">
                              28
                            </td>
                            <td className="py-1 px-5hover:bg-slate-200">29</td>
                            <td className="py-1 px-5opacity-75 hover:bg-slate-200">
                              01
                            </td>
                            <td className="py-1 px-5opacity-75 hover:bg-slate-200">
                              02
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </section>
        </section>
      </section>
    </>
  );
}
