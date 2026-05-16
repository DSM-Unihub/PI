import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";

export default function NavBar() {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    delete axios.defaults.headers.common["Authorization"];
    router.push("/login");
  };
  const pathname = usePathname();
  const isActive = (route) => pathname === route;
  return (
    <>
      {/* Mobile Nav Bar */}
      <section className="navMob-container">
        <div
          className={`navIcon-container ${
            isActive("/") ? "rounded-3xl bg-azul-principal" : "brightness-50"
          }`}
        >
          <Link href="/">
            <img alt="" className="navIcon " src="/icons/home.svg" />
          </Link>
        </div>
        <div
          className={`navIcon-container ${
            isActive("/estatisticas")
              ? "rounded-3xl bg-azul-principal"
              : "brightness-50"
          }`}
        >
          <Link href="/estatisticas">
            <img alt="" className="navIcon " src="/icons/Stats.svg" />
          </Link>
        </div>
        <div
          className={`navIcon-container ${
            isActive("/bloqueios")
              ? "rounded-3xl bg-azul-principal"
              : "brightness-50"
          }`}
        >
          <Link href="/bloqueios">
            <img alt="" className="navIcon " src="/icons/Bloqueios.svg" />
          </Link>
        </div>
        <div
          className={`navIcon-container ${
            isActive("/usuarios")
              ? "rounded-3xl bg-azul-principal"
              : "brightness-50"
          }`}
        >
          <Link href="/usuarios">
            <img alt="" className="navIcon " src="/icons/Usuarios.svg" />
          </Link>
        </div>
        <div
          className={`navIcon-container ${
            isActive("/config")
              ? "rounded-3xl bg-azul-principal"
              : "brightness-50"
          }`}
        >
          <Link href="">
            <img alt="" className="navIcon " src="/icons/Configs.svg" />
          </Link>
        </div>
        <div className={`navIcon-container brightness-50`}>
          <button onClick={logout}>
            <img alt="" className="navIcon " src="/icons/Logout.svg" />
          </button>
        </div>
      </section>
      {/* Web Nav Bar */}
      <section className="navDesk-container">
        <div className="flex flex-col h-fit">
          <Link href="/">
            <img alt="" className="size-10" src="/icons/lg-resist-w.svg" />
            <img alt="" className="size-10  " src="/icons/tx-resist.svg" />
          </Link>
        </div>
        <div className="navIcons-container">
          <div className="flex flex-col gap-9">
            <div
              className={`navIcon-container ${
                isActive("/") ? "rounded-3xl bg-cinza-principal brightness" : ""
              }`}
            >
              <Link href="/">
                <img alt="" className="navIcon " src="/icons/home.svg" />
              </Link>
            </div>
            <div
              className={`navIcon-container ${
                isActive("/estatisticas")
                  ? "rounded-3xl bg-cinza-principal"
                  : ""
              }`}
            >
              <Link href="/estatisticas">
                <img alt="" className="navIcon " src="/icons/Stats.svg" />
              </Link>
            </div>

            <div
              className={`navIcon-container ${
                isActive("/bloqueios")
                  ? "rounded-3xl bg-cinza-principal brightness"
                  : ""
              }`}
            >
              <Link href="/bloqueios">
                <img alt="" className="navIcon " src="/icons/Bloqueios.svg" />
              </Link>
            </div>

            <div
              className={`navIcon-container ${
                isActive("/usuarios")
                  ? "rounded-3xl bg-cinza-principal brightness"
                  : ""
              }`}
            >
              <Link href="/usuarios">
                <img alt="" className="navIcon " src="/icons/Usuarios.svg" />
              </Link>
            </div>
            <div
              className={`navIcon-container ${
                isActive("/sugestao")
                  ? "rounded-3xl bg-cinza-principal brightness duration-300 "
                  : ""
              }`}
            >
              <Link href="/sugestao">
                <img alt="" className="navIcon " src="/icons/lampada.svg" />
              </Link>
              {/* AQUI */}
            </div>
          </div>

          
          <div className="flex flex-col justify-center gap-5">

            <div
              className={`navIcon-container ${
                isActive("/config")
                  ? "rounded-3xl bg-cinza-principal brightness duration-300"
                  : ""
              }`}
            >
              <Link href="">
                <img alt="" className="navIcon " src="/icons/Configs.svg" />
              </Link>
            </div>

            <div className={`navIcon-container`}>
              <button onClick={logout}>
                <img alt="" className="navIcon " src="/icons/Logout.svg" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
