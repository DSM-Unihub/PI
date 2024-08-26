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
      <div className="flex flex-col gap-10 h-screen justify-between">
        <div className="flex flex-col gap-10">
          <div className=" w-max h-max">
            <a href="/">
              <img
                className=" size-10 hover:scale-110 duration-300 hover:pointer"
                src="/icons/home.svg"
              />
            </a>
          </div>
          <a href="/estatisticas">
            <img
              className="size-10 hover:scale-110 duration-300 hover:pointer"
              src="/icons/Stats.svg"
            />
          </a>
          <a href="/bloqueios">
            <img
              className="size-10 hover:scale-110 duration-300 hover:pointer"
              src="/icons/Bloqueios.svg"
            />
          </a>
          <a href="/usuarios">
            <img
              className="size-10 hover:scale-110 duration-300 hover:pointer"
              src="/icons/Usuarios.svg"
            />
          </a>
        </div>
        <div className="flex flex-col justify-center gap-5">
          <img
            className="size-10 hover:scale-110 duration-300 hover:pointer"
            src="/icons/Ajudamenu.svg"
          />
          <a href="/config">
            <img
              className="size-10 hover:scale-110 duration-300 hover:pointer"
              src="/icons/Configs.svg"
            />
          </a>
          <a href="/logout">
            <img
              className="size-10 hover:scale-110 duration-300 hover:pointer"
              src="/icons/Logout.svg"
            />
          </a>
        </div>
      </div>
    </>
  );
}
