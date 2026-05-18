import { useState, useEffect } from "react";
import axios from "axios";
import url from "../services/url";
import Image from "next/image";

const Lockdown = () => {
  const [bloqueios, setBloqueios] = useState({});
  const [bloqueiosMesA, setBloqueiosMesA] = useState({}); //
  const [bloqueiosDoisMesesAtras, setBloqueiosDoisMesesAtras] = useState({}); //
  const [porcentagem, setPorcentagem] = useState("");
  const [mediaMovel, setMediaMovel] = useState("");
  const fetchBloqueios = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${url}/estatisticas-mes`);
      setBloqueios(response.data.mesAtual);
      setPorcentagem(response.data.porcentagemVariacaoMesAnterior);
      setBloqueiosMesA(response.data.mesAnterior);
      setBloqueiosDoisMesesAtras(response.data.doisMesesAtras);
      setMediaMovel(response.data.mediaMovelTresMeses);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchBloqueios();
  }, []);
  return (
    <section className="component-container">
      <div className="hidden lg:flex flex-col bg-azul-principal rounded-xl">
        <h2 className="text-white p-2 text-base">Visão geral de bloqueios</h2>
        <div className="grid grid-cols-3">
          <div className="bg-white flex flex-row rounded-bl-xl p-3 xl:p-5 gap-2">
            <img alt="" src="./icons/Rectangle.svg" />
            <p className="text-sm self-center text-azul-title xl:text-nowrap lg:text-wrap">
              <span className=" text-azul-title lg:text-xl text-3xl">{bloqueios.bloqueios}</span> bloq.
              totais
              <br />
              <span className="text-red-600">{porcentagem > 0 ? '+' : '-'}{porcentagem}%</span> Neste mês
            </p>
          </div>
          <div className="bg-white flex flex-row rounded-br-xl items-center gap-2 p-3 xl:p-5">
            <img alt="" src="./icons/Rectangle.svg" />
            <img alt="" className="lg:size-4 size-8" src={`${porcentagem > 0 ? './icons/arrowUL.svg' : './icons/arrowDV.svg'}`} />
            <p className="text-sm self-center text-azul-title xl:text-nowrap">
              <span className="lg:text-xl text-3xl">{porcentagem}%</span>
              <br />
              desde o último mês
            </p>
          </div>
          <div className="bg-azul-gradiente-final flex flex-col rounded-br-xl items-center justify-center">
            <p className="text-base text-white">
              <span className="lg:text-2xl text-4xl">{bloqueiosMesA.bloqueios}</span> em {bloqueiosMesA.mes}/{bloqueiosMesA.ano}
            </p>
            <p className="text-base text-white">
              <span className="lg:text-2xl text-4xl">{bloqueiosDoisMesesAtras.bloqueios}</span> em {bloqueiosDoisMesesAtras.mes}/{bloqueiosDoisMesesAtras.ano}
              
            </p>
          </div>
        </div>
      </div>
      <h3 className="title lg:hidden">Bloqueios totais</h3>
      <div className="lockdownStatic-container">
        <img src="./icons/Rectangle.svg" alt="Lockdown Icon" />
        <p className="text-3xl font-bold text-azul-cinza-escuro">
          {bloqueios.bloqueios}
        </p>
        <p className="text">
          Bloqueios totais <br />
          <span className="text-laranja-s">+{porcentagem}%</span> este mês
        </p>
        <div className="lockdownArrow-container">
          <img  className={`size-8 ${porcentagem <= 0 ? 'rotate-180' : ''}`}  src={`${porcentagem > 0 ? './icons/arrowUL.svg' : './icons/arrowDC.svg'}`} alt="Arrow Up" />
          <img  className={`size-8`}  src={`${porcentagem <= 0 ? './icons/arrowDV.svg' : './icons/arrowDC.svg'}`} alt="Arrow Down" />
        </div>
      </div>
      <div className="lockdownStatic-container">
        <img  src="./icons/Rectangle.svg" alt="Lockdown Icon" />
        <p className="text-3xl font-bold text-azul-cinza-escuro">
          {mediaMovel}
        </p>
        <p className="text">
          Media Móvel ultimos 3 meses <br />
        </p>
        <div className="lockdownArrow-container">
        <img className={`size-8 ${porcentagem <= 0 ? 'rotate-180' : ''}`}  src={`${porcentagem > 0 ? './icons/arrowUL.svg' : './icons/arrowDC.svg'}`} alt="Arrow Up" />
          <img  className={`size-8`}  src={`${porcentagem <= 0 ? './icons/arrowDV.svg' : './icons/arrowDC.svg'}`} alt="Arrow Down" />
        </div>
      </div>
    </section>
  );
};

export default Lockdown;
