import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head.js";
import NavBar from "../../components/navBar/NavBar.js";
import HeaderBar from "@/components/headerBar/HeaderBar.js";
import Incidencia from "../../components/Incidencia.js";
import Lockdown from "../../components/Lockdown.js";
import ActiveDevices from "../../components/ActiveDevices.js";
import Calendar from "react-calendar";
import FooterContent from "../../components/FooterContent.js";
import RecentActivity from "../../components/RecentActivity.js";
import CardInfo from "@/components/card/card.js";
import styles from './index.module.css'
import { Height } from "@mui/icons-material";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { ArrowDown, ChevronDown, FlagTriangleLeft, MoreVertical, Triangle, Lock, Monitor, Smartphone, User } from "lucide-react";
export default function Home() {
  const [value, onChange] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();


  const [dataAtual, setDataAtual] = useState(new Date());
  const [monthA, setmonthA] = useState(new Date());
  const [dayA, setdayA] = useState(new Date());
  const diasSemana = ["D", "S", "T", "Q", "Q", "S", "S"];
  const mesAno = dataAtual.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const month = monthA.toLocaleDateString("pt-BR", { month: "long" });
  const year = dayA.toLocaleDateString("pt-BR", { year: "numeric" });
  const ano = dataAtual.getFullYear();
  const mes = dataAtual.getMonth();

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
  const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();

  const dias = [];


  const atividades = [
    {
      titulo: "Novo bloqueio realizado automaticamente pelo sistema",
      data: "22/03/24",
      icon: <Lock />
    },
    {
      titulo: "Novo dispositivo desktop cadastrado",
      data: "21/03/24",
      icon: <Monitor />
    },
    {
      titulo: "Novo dispositivo móvel cadastrado",
      data: "21/03/24",
      icon: <Smartphone />
    },
    {
      titulo: "Nova exceção adicionada manualmente",
      data: "20/03/24",
      icon: <User />
    },
    {
      titulo: "Novo usuário criado pelo administrador",
      data: "19/03/24",
      icon: <User />
    },
    {
      titulo: "Novo bloqueio realizado automaticamente pelo sistema",
      data: "22/03/24",
      icon: <Lock />
    },
    {
      titulo: "Novo dispositivo desktop cadastrado",
      data: "21/03/24",
      icon: <Monitor />
    },
    {
      titulo: "Novo dispositivo móvel cadastrado",
      data: "21/03/24",
      icon: <Smartphone />
    },
    {
      titulo: "Novo usuário criado pelo administrador",
      data: "19/03/24",
      icon: <User />
    },
    {
      titulo: "Novo bloqueio realizado automaticamente pelo sistema",
      data: "22/03/24",
      icon: <Lock />
    },
    {
      titulo: "Novo dispositivo desktop cadastrado",
      data: "21/03/24",
      icon: <Monitor />
    },
    {
      titulo: "Novo dispositivo móvel cadastrado",
      data: "21/03/24",
      icon: <Smartphone />
    },
    {
      titulo: "Novo usuário criado pelo administrador",
      data: "19/03/24",
      icon: <User />
    },
    {
      titulo: "Novo bloqueio realizado automaticamente pelo sistema",
      data: "22/03/24",
      icon: <Lock />
    },
    {
      titulo: "Novo dispositivo desktop cadastrado",
      data: "21/03/24",
      icon: <Monitor />
    },
    {
      titulo: "Novo dispositivo móvel cadastrado",
      data: "21/03/24",
      icon: <Smartphone />
    }
  ];

  const laboratorios = [
    {
      nome: "Laboratório 01",
      porcentagem: 42,
      cor: "#DD5151"
    },
    {
      nome: "Laboratório 02",
      porcentagem: 65,
      cor: "#DD5151"
    },
    {
      nome: "Laboratório 03",
      porcentagem: 28,
      cor: "#DD5151"
    },
    {
      nome: "Laboratório 04",
      porcentagem: 61,
      cor: "#DD5151"
    },
    {
      nome: "Laboratório 05",
      porcentagem: 42,
      cor: "#DD5151"
    },
    {
      nome: "Laboratório 06",
      porcentagem: 10,
      cor: "#DD5151"
    },
    {
      nome: "Laboratório 07",
      porcentagem: 84,
      cor: "#DD5151"
    },
    {
      nome: "Laboratório 08",
      porcentagem: 82,
      cor: "#DD5151"
    }, {
      nome: "Laboratório 09",
      porcentagem: 21,
      cor: "#DD5151"
    }, {
      nome: "Laboratório 10",
      porcentagem: 3,
      cor: "#DD5151"
    }
  ];

  // Dias do mês anterior
  for (let i = primeiroDia - 1; i >= 0; i--) {
    dias.push({
      numero: ultimoDiaMesAnterior - i,
      mesAtual: false
    });
  }

  // Dias do mês atual
  for (let i = 1; i <= ultimoDia; i++) {
    dias.push({
      numero: i,
      mesAtual: true
    });
  }

  // Dias do próximo mês
  while (dias.length < 42) {
    dias.push({
      numero: dias.length - (primeiroDia + ultimoDia) + 1,
      mesAtual: false
    });
  }

  const trocarMes = (incremento) => {
    setDataAtual(new Date(ano, mes + incremento, 1));
    setmonthA(new Date(ano, mes + incremento, 1));
    setdayA(new Date(ano, mes + incremento, 1))
  };


  // Verificar autenticação e carregar usuário
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      const user = JSON.parse(localStorage.getItem("usuario"));
      setUsuario(user);
    }
    setIsMounted(true); // Marcar como montado
  }, [router]);

  // Mostrar um carregamento enquanto verifica autenticação
  if (!isMounted) {
    return <p>Carregando...</p>;
  }

  // Redirecionar caso o usuário não esteja autenticado
  if (!usuario) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <Head>
        <title>Resist</title>
      </Head>
      <section className={styles.body}>
        <NavBar />
        <section className={styles.conteudoCentral}>
          <section className={styles.conteudo}>
            <section className={styles.cem}>
              <HeaderBar usuario={usuario} />
              <section className={styles.section} >

                <div style={{ flex: 1, maxHeight: "100%", minWidth: "48%" }}>
                  <div className={styles.formulario} >
                    <section style={{ width: "100%" }} >
                      {/* <CardInfo titulo={`Olá, ${usuario?.nome}`} subtitulo={"Bem-vindo de volta ao seu dashboard."} /> */}

                      <div className={styles.wrapper}>
                        <div className={styles.card}>
                          <p className="">Olá, {usuario?.nome}</p>
                          <h4 className="">Bem-vindo de volta ao seu dashboard.</h4>
                        </div>
                      </div>
                    </section>

                    <section className={styles.content} >

                      <div className={styles.contentAtiv}>
                        <p>Atividade recente</p>
                        <div className={styles.contentInfo} ><p>Este mês</p>
                          <ChevronDown />
                        </div>
                      </div>

                      <div className={styles.scroll} style={{ height: "520px", alignContent: "flex-start" }} >
                        {atividades.map((item, index) => (
                          <div key={index} className={styles.contentAtiv}>
                            <div className={styles.contentInfo}>
                              <div className={styles.contentInfo}>{item.icon}</div>
                              <p>{item.titulo}</p>
                            </div>
                            <div className={styles.contentInfo}>
                              <p>{item.data}</p>
                              <MoreVertical />
                            </div>
                          </div>
                        ))}


                      </div>


                    </section>

                    <section className={styles.content}>
                      <div style={{ width: "100%" }} >
                        <p>Visão geral de bloqueios</p>

                      </div>

                      <div className={styles.contentInfoBloq}>
                        <div className={styles.contentInfo2}>
                          <div className={styles.contentBloq} >
                            <div className={styles.containerPe} ></div>
                            <div className={styles.containerItemVal}>
                              <div className={styles.containerVal}><h3 className={styles.textEdit} style={{ fontSize: "50px" }}>462</h3><p className={styles.textEdit} style={{ width: "40px", wordWrap: "break-word" }} >Bloq.totais</p></div>
                              <div className={styles.containerVal}><p>+23% &nbsp;</p><p>neste mês</p></div>
                            </div>
                          </div>

                          <div className={styles.contentBloq}>
                            <div className={styles.containerPe} ></div>
                            <div className={styles.containerItemVal}>
                              <div className={styles.containerVal}><Triangle size={30} color="#DD5151" fill="#DD5151" strokeWidth={0} /> <h3 className={styles.textEdit} style={{ fontSize: "50px" }}>26%</h3></div>
                              <div className={styles.containerVal}><p>Desde o último mês</p></div>
                            </div>
                          </div>
                        </div>

                        <div className={styles.contentInfoBloqMes} >
                          <div className={styles.containerValChao} >
                            <h3 className={styles.textEdit} style={{ fontSize: "50px" }}>381 </h3><p className={styles.textEdit}>em maio</p></div>
                          <div className={styles.containerValChao}>
                            <h3 className={styles.textEdit} style={{ fontSize: "50px" }}>428 </h3><p className={styles.textEdit}> em abril</p>
                          </div>
                        </div>

                      </div>
                    </section>
                  </div>
                </div>

                <div style={{ flex: 1, minWidth: "48%" }}>
                  <div className={styles.formulario} >



                    <section className={styles.content} >


                      <div className={styles.contentAtiv}>
                        <h2>Nível de incidência por laboratório</h2>

                      </div>

                      <div className={styles.containerIncidencia}>
                        {laboratorios.map((lab, index) => (
                          <div key={index} className={styles.Incidencia}>
                            <div style={{ width: "100%", textAlign: "center" }}>
                              <p>{lab.nome}</p>
                            </div>
                            <div
                              className={styles.Incidenredondo}
                              style={{
                                background: `conic-gradient(${lab.cor} 0% ${lab.porcentagem}%, #E6EBFA ${lab.porcentagem}% 100%)`
                              }}
                            >
                              <div>
                                <p>{lab.porcentagem}%</p>
                              </div>
                            </div>
                          </div>
                        ))}

                      </div>


                    </section>

                    <section className={styles.content} >


                      <div className={styles.calendario}>
                        <div className={styles.header}>
                          <div><p>Histórico por data</p></div>
                          <div className={styles.contentInfo}><button className={styles.botaoMes} onClick={() => trocarMes(-1)}>{"<"}</button>
                            <h2>{month}</h2>
                            <button className={styles.botaoMes} onClick={() => trocarMes(1)}>{">"}</button></div>
                          <div><h2>{year}</h2></div>

                        </div>

                        <div className={styles.diasSemana}>
                          {diasSemana.map((dia) => (
                            <div key={dia} className={styles.diaSemana}>{dia}</div>
                          ))}
                        </div>

                        <div className={styles.dias}>
                          {dias.map((dia, index) => (
                            <div
                              key={index}
                              className={`${styles.dia} 
                ${dia.numero === new Date().getDate() &&
                                  mes === new Date().getMonth() &&
                                  dia.mesAtual ? styles.hoje : ""}
                ${!dia.mesAtual ? styles.diaForaMes : ""}
              `}
                            >
                              {dia.numero}
                            </div>
                          ))}
                        </div>
                      </div>


                    </section>


                  </div>
                </div>
              </section>
            </section>
          </section>
        </section>
      </section>

    </>
  );
}

// Componente de Bem-Vindo
function Welcome({ usuario }) {
  return (
    <div className="welcomeArea">
      <p className="text-4xl text-white">Olá, {usuario.nome}</p>
      <p className="text-2xl text-white">
        Bem-vindo de volta ao seu dashboard.
      </p>
    </div>
  );
}
