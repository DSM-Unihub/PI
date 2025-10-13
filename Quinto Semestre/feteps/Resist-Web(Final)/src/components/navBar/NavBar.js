import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import styles from "./nav.module.css";
import { ArrowLeftEndOnRectangleIcon, Cog8ToothIcon, HomeIcon } from '@heroicons/react/24/outline';
import { ArrowTrendingUpIcon, LightBulbIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
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
      <section className={styles.navMobContainer}>
        <div
          className={`navIcon-container ${
            isActive("/index") ? "rounded-3xl bg-azul-principal" : "brightness-50"
          }`}
        >
          <Link href="/index">
            <img alt="" className="navIcon " src="/icons/home.svg" />
          </Link>
        </div>
        <div
          className={`navIcon-container ${
            isActive("/estastisticas")
              ? "rounded-3xl bg-azul-principal"
              : "brightness-50"
          }`}
        >
          <Link href="/estastisticas">
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
      <section className={styles.navDesk}>
        <div className={styles.imgResist}>
          <Link href="/">
            <img alt="" className="size-10" src="/icons/lg-resist-w.svg" />
            <img alt="" className="size-10  " src="/icons/tx-resist.svg" />
          </Link>
        </div>
        
          <div className={styles.navIconMid}>
            <div
              className={isActive("/index") ? styles.navIconSelected : styles.navIcon}  
            >
              <Link href="/index">
              <HomeIcon  className={isActive("/index") ? styles.iconSelect : styles.icon}/>
                {/* <AiOutlineHome  size={24} color="#fff" /> */}
              </Link>
            </div>
            <div
             className={isActive("/estastisticas") ? styles.navIconSelected : styles.navIcon}
            >
              <Link href="/estastisticas">
              <ArrowTrendingUpIcon className={isActive("/estastisticas") ? styles.iconSelect : styles.icon}/>
                {/* <img alt="" className="navIcon " src="/icons/Stats.svg" /> */}
              </Link>
            </div>

            <div
              className={isActive("/bloqueios") ? styles.navIconSelected : styles.navIcon}
            >
              <Link href="/bloqueios">
              <LockClosedIcon  className={isActive("/bloqueios") ? styles.iconSelect : styles.icon}/>
                
              </Link>
            </div>

            <div
              className={isActive("/usuarios") ? styles.navIconSelected : styles.navIcon}
            >
              <Link href="/usuarios">
              <UserIcon className={isActive("/usuarios") ? styles.iconSelect : styles.icon}/>
              {/* <IoPersonOutline size={24} color="#fff"/> */}
                {/* <img alt="" className="navIcon " src="/icons/Usuarios.svg" /> */}
              </Link>
            </div>
            <div className={isActive("/sugestao") ? styles.navIconSelected : styles.navIcon}>
              <Link href="/sugestao">
                <LightBulbIcon className={isActive("/sugestao") ? styles.iconSelect : styles.icon}/>
              </Link>
          </div>

          </div>
        <div className={styles.navIconMid}>
          {/* config */}
          <div
            className={isActive("/config") ? styles.navIconSelected : styles.navIcon}
          >
            <Link href="">
            <Cog8ToothIcon className={isActive("/config") ? styles.iconSelect : styles.icon} />
              {/* <img alt="" className="navIcon " src="/icons/Configs.svg" />z */}
            </Link>
          </div>

          <div className={styles.navIcon}>
            <button onClick={logout}>
              {/* <img alt="" className="navIcon " src="/icons/Logout.svg" /> */}
              <ArrowLeftEndOnRectangleIcon className={styles.icon} />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
