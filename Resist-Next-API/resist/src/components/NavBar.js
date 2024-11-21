import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function NavBar() {
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
            <Image alt="" className="navIcon " src="/icons/home.svg" />
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
            <Image alt="" className="navIcon " src="/icons/Stats.svg" />
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
            <Image alt="" className="navIcon " src="/icons/Bloqueios.svg" />
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
            <Image alt="" className="navIcon " src="/icons/Usuarios.svg" />
          </Link>
        </div>
        <div
          className={`navIcon-container ${
            isActive("/config")
              ? "rounded-3xl bg-azul-principal"
              : "brightness-50"
          }`}
        >
          <Link href="/config">
            <Image alt="" className="navIcon " src="/icons/Configs.svg" />
          </Link>
        </div>
      </section>
      {/* Web Nav Bar */}
      <section className="navDesk-container">
        <div className="flex flex-col h-fit">
          <Link href="/">
            <Image alt="" className="size-10" src="/icons/lg-resist-w.svg" />
            <Image alt="" className="size-10  " src="/icons/tx-resist.svg" />
          </Link>
        </div>
        <div className="navIcons-container">
          <div className="flex flex-col gap-8">
            <div
              className={`navIcon-container ${
                isActive("/") ? "rounded-3xl bg-cinza-principal brightness" : ""
              }`}
            >
              <Link href="/">
                <Image alt="" className="navIcon " src="/icons/home.svg" />
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
                <Image alt="" className="navIcon " src="/icons/Stats.svg" />
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
                <Image alt="" className="navIcon " src="/icons/Bloqueios.svg" />
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
                <Image alt="" className="navIcon " src="/icons/Usuarios.svg" />
              </Link>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-5">
            
          <div className={`navIcon-container ${isActive('/ajuda') ? 'rounded-3xl bg-cinza-principal brightness duration-300 ' : ''}`}>
          <Link href="/ajuda">
            <Image alt="" className="navIcon " src="/icons/Ajudamenu.svg" />
          </Link>
          </div>
          <div className={`navIcon-container ${isActive('/config') ? 'rounded-3xl bg-cinza-principal brightness duration-300' : ''}`}>
            <Link href="/config">
              <Image alt="" className="navIcon " src="/icons/Configs.svg" />
            </Link>
          </div>
          
          <div className={`navIcon-container ${isActive('/logout') ? 'rounded-3xl bg-cinza-principal brightness duration-300' : ''}`}>
            <Link href="/login">
              <Image alt="" className="navIcon " src="/icons/Logout.svg" />
            </Link>
          </div>
          </div>
        </div>
      </section>
    </>
  );
}
