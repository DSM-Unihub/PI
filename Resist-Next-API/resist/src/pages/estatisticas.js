import { useState, useEffect } from "react";
import NavBar from "../components/NavBar.js";
import HeaderBar from "../components/HeaderBar.js";
import EstatisticasMes from "../components/EstatisticasMes.js";
import FooterContent from "../components/FooterContent.js";
import { useRouter } from "next/router.js";
import Head from "next/head.js";
export default function Estatisticas() {
  const router = useRouter()
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      const user = JSON.parse(localStorage.getItem("usuario"));
      setUsuario(user);
    }
  }, [router]);

  if (!usuario) return router.push("/login");
  return (
    <>
    <Head>
    <title>Estatisticas</title>
    </Head>
      <section className="container-principal ">
        {/* Left Navigation Bar */}
          <NavBar />
        {/* Main Content Area */}
        <section className="main-container ">
           <HeaderBar usuario={usuario} />
          {/* Dashboard Principal */}
          <section className="flex flex-col px-4 gap-1">
            <div className="bg-gradient-to-r from-laranja-s h-fit to-laranja-e p-5 rounded-xl max-w-xl">
              <h2 className="lg:text-2xl text-4xl text-white">Estatísticas</h2>
              <p className="lg:text-lg text-2xl text-white">
                Acesso aos dados de bloqueio.
              </p>
            </div>
            <EstatisticasMes />
          </section>
        </section>
      </section>
      <FooterContent />
    </>
  );
}
