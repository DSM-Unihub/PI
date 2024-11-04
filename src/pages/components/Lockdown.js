const Lockdown = () => {
  return (
    <section className="component-container">
      <div className="hidden lg:flex flex-col bg-azul-principal rounded-xl">
        <h2 className="text-white p-2 text-base">Visão geral de bloqueios</h2>
        <div className="grid grid-cols-3">
          <div className="bg-white flex flex-row rounded-bl-xl p-3 xl:p-5 gap-2">
            <img src="./icons/Rectangle.svg"/>
            <p className="text-sm self-center text-azul-title xl:text-nowrap lg:text-wrap">
              <span className=" text-azul-title text-3xl">462</span> bloq. totais
              <br />
              <span className="text-red-600">+23%</span> Neste mês
            </p>
          </div>
          <div className="bg-white flex flex-row rounded-br-xl items-center gap-2 p-3 xl:p-5">
            <img src="./icons/Rectangle.svg"/>
            <img className="size-8" src="./icons/arrowUL.svg"/>
            <p className="text-sm self-center text-azul-title xl:text-nowrap">
            
             <span className="text-3xl">26%</span>
              <br />
              desde o último mês
            </p>
          </div>
          <div className="bg-azul-gradiente-final flex flex-col rounded-br-xl items-center justify-center">
            <p className="text-base text-white"><span className="text-4xl">381</span> em Setembro</p>
            <p className="text-base text-white"><span className="text-4xl">428</span> em Outubro</p>
          </div>
        </div>
      </div>
      <h3 className="title lg:hidden">Bloqueios totais</h3>
      <div className="lockdownStatic-container">
        <img src="./icons/rectangle.svg" alt="Lockdown Icon" />
        <p className="text-3xl font-bold text-azul-cinza-escuro">462</p>
        <p className="text">
          Bloqueios totais <br />
          <span className="text-laranja-s">+23%</span> este mês
        </p>
        <div className="lockdownArrow-container">
          <img className="size-8" src="./icons/arrowUL.svg" alt="Arrow Up" />
          <img className="size-8" src="./icons/arrowDC.svg" alt="Arrow Down" />
        </div>
      </div>
    </section>
  );
};

export default Lockdown;
