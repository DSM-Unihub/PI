const Lockdown = () => {
  return (
    <section className="lockdown-container">
      <h3 className="title">Bloqueios totais</h3>
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
