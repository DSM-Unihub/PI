export default function NavBar() {
  return (
    <>
      <div className="flex flex-col gap-5 h-fit">
        <a href="/">
          <img className="size-10" src="/icons/lg-resist-w.svg" />
          <img className="size-10  " src="/icons/tx-resist.svg" />
        </a>
      </div>
      <br />
      <div className="navIcons-container">
        <div className="flex flex-col gap-10">
            <a href="/">
              <img
                className="navIcon "
                src="/icons/home.svg"
              />
            </a>
          <a href="/estatisticas">
            <img
              className="navIcon "
              src="/icons/Stats.svg"
            />
          </a>
          <a href="/bloqueios">
            <img
              className="navIcon "
              src="/icons/Bloqueios.svg"
            />
          </a>
          <a href="/usuarios">
            <img
              className="navIcon "
              src="/icons/Usuarios.svg"
            />
          </a>
        </div>
        <div className="flex flex-col justify-center gap-5">
          <img
            className="navIcon "
            src="/icons/Ajudamenu.svg"
          />
          <a href="/config">
            <img
              className="navIcon "
              src="/icons/Configs.svg"
            />
          </a>
          <a href="/logout">
            <img
              className="navIcon "
              src="/icons/Logout.svg"
            />
          </a>
        </div>
      </div>
    </>
  );
}
