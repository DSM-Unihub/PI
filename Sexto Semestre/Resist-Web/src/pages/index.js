import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import axios from "axios";
import url from "../services/url";
import Head from "next/head.js";
import NavBar from "../components/navBar/NavBar.js";
import HeaderBar from "@/components/headerBar/HeaderBar.js";
import Incidencia from "../components/Incidencia.js";
import Lockdown from "../components/Lockdown.js";
import ActiveDevices from "../components/ActiveDevices.js";
import Calendar from "react-calendar";
import FooterContent from "../components/FooterContent.js";
import RecentActivity from "../components/RecentActivity.js";
import CardInfo from "@/components/card/card.js";
import styles from './index.module.css'
import { Height } from "@mui/icons-material";
import { ArrowDownTrayIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { ArrowDown, ChevronDown, FlagTriangleLeft, MoreVertical, Triangle, Lock, Monitor, Smartphone, User, LockOpenIcon, CheckCircleIcon } from "lucide-react";
export default function Home() {
  const [value, onChange] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const router = useRouter();
const [dadosBloqueio,
  setDadosBloqueio] =
  useState(null);

   const [dataAtual, setDataAtual] = useState(new Date());
  // const [monthA, setmonthA] = useState(new Date());
  // const [dayA, setdayA] = useState(new Date());


  
  const diasSemana = ["D", "S", "T", "Q", "Q", "S", "S"];
  const mesAno = dataAtual.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  
const month =
  dataAtual.toLocaleDateString(
    "pt-BR",
    {
      month: "long",
    }
  );

const year =
  dataAtual.getFullYear();

const ano =
  dataAtual.getFullYear();

const mes =
  dataAtual.getMonth();

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
  const ultimoDiaMesAnterior = new Date(ano, mes, 0).getDate();


  const dias = [];
const [atividades, setAtividades] = useState([]);

  // const atividades = [
  //   {
  //     titulo: "Novo bloqueio realizado automaticamente pelo sistema",
  //     data: "22/03/24",
  //     icon: <Lock />
  //   },
  //   {
  //     titulo: "Novo dispositivo desktop cadastrado",
  //     data: "21/03/24",
  //     icon: <Monitor />
  //   },
  //   {
  //     titulo: "Novo dispositivo móvel cadastrado",
  //     data: "21/03/24",
  //     icon: <Smartphone />
  //   },
  //   {
  //     titulo: "Nova exceção adicionada manualmente",
  //     data: "20/03/24",
  //     icon: <User />
  //   },
  //   {
  //     titulo: "Novo usuário criado pelo administrador",
  //     data: "19/03/24",
  //     icon: <User />
  //   },
  //   {
  //     titulo: "Novo bloqueio realizado automaticamente pelo sistema",
  //     data: "22/03/24",
  //     icon: <Lock />
  //   },
  //   {
  //     titulo: "Novo dispositivo desktop cadastrado",
  //     data: "21/03/24",
  //     icon: <Monitor />
  //   },
  //   {
  //     titulo: "Novo dispositivo móvel cadastrado",
  //     data: "21/03/24",
  //     icon: <Smartphone />
  //   },
  //   {
  //     titulo: "Novo usuário criado pelo administrador",
  //     data: "19/03/24",
  //     icon: <User />
  //   },
  //   {
  //     titulo: "Novo bloqueio realizado automaticamente pelo sistema",
  //     data: "22/03/24",
  //     icon: <Lock />
  //   },
  //   {
  //     titulo: "Novo dispositivo desktop cadastrado",
  //     data: "21/03/24",
  //     icon: <Monitor />
  //   },
  //   {
  //     titulo: "Novo dispositivo móvel cadastrado",
  //     data: "21/03/24",
  //     icon: <Smartphone />
  //   },
  //   {
  //     titulo: "Novo usuário criado pelo administrador",
  //     data: "19/03/24",
  //     icon: <User />
  //   },
  //   {
  //     titulo: "Novo bloqueio realizado automaticamente pelo sistema",
  //     data: "22/03/24",
  //     icon: <Lock />
  //   },
  //   {
  //     titulo: "Novo dispositivo desktop cadastrado",
  //     data: "21/03/24",
  //     icon: <Monitor />
  //   },
  //   {
  //     titulo: "Novo dispositivo móvel cadastrado",
  //     data: "21/03/24",
  //     icon: <Smartphone />
  //   }
  // ];

const [laboratorios, setLaboratorios] =
  useState([]);

const [
  dataSelecionada,
  setDataSelecionada,
] = useState(new Date());

useEffect(() => {
  const fetchIncidencia =
    async (
      data = new Date()
    ) => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        const dia =
          data.getDate();

        const mes =
          data.getMonth() + 1;

        const ano =
          data.getFullYear();

        const response =
          await axios.get(
            `${url}/rede/incidencia`,
            {
              params: {
                dia,
                mes,
                ano,
              },
            }
          );

        console.log(
          "INCIDENCIA:",
          response.data
        );

        setLaboratorios(
          response.data.data ||
            []
        );
      } catch (error) {
        console.error(
          "Erro ao buscar incidência:",
          error
        );
      }
    };

  fetchIncidencia(
    dataSelecionada
  );
}, [dataSelecionada]);
const formatarAcao = (acao) => {
  const mapa = {
    criacao_bloqueio: "Criou um bloqueio",
    Criacao_bloqueio_URL: "Criou um bloqueio URL",
    criacao_usuario: "Criou um usuário",
    update_bloqueio_bloqueado: "Realizou um bloqueio",

    update_bloqueio_desbloqueado:
      "Realizou um desbloqueio",

    aceite_sugestao:
      "Aceitou uma sugestão",

    recusa_sugestao:
      "Recusou uma sugestão",

    remocao_bloqueio:
      "Removeu um bloqueio",

    DELETAR_BLOQUEIO:
      "Deletou um bloqueio",
    
    };

  return mapa[acao] || acao;
};
const getIcon = (acao) => {
  switch (acao) {
    case "update_bloqueio_desbloqueado":
      return (
        <LockOpenIcon className="w-5 h-5 text-green-500" />
      );

    case "criacao_bloqueio":
    case "Criacao_bloqueio_URL":
    case "update_bloqueio_bloqueado":
      return (
        <LockClosedIcon className="w-5 h-5 text-red-500" />
      );

    case "aceite_sugestao":
      return (
        <CheckCircleIcon className="w-5 h-5 text-green-500" />
      );

    case "recusa_sugestao":
      return (
        <XCircleIcon className="w-5 h-5 text-red-500" />
      );
      case "criacao_usuario":
      return (
        <CheckCircleIcon className="w-5 h-5 text-green-500" />
      );
    default:
      return (
        <LockClosedIcon className="w-5 h-5 text-gray-400" />
      );
  }
};
useEffect(() => {
  const fetchPreviewLogs = async () => {
    try {
      const token = localStorage.getItem("token");

      console.log("TOKEN:", token);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;

      console.log("URL:", `${url}/logs/preview`);

      const resposta = await axios.get(
        `${url}/logs/preview`
      );

      console.log("RESPOSTA API:", resposta);

      setAtividades(resposta.data.data);
    } catch (error) {
      console.error(
        "Erro ao buscar preview dos logs:",
        error
      );

      console.log(
        "response:",
        error?.response
      );

      console.log(
        "status:",
        error?.response?.status
      );

      console.log(
        "data:",
        error?.response?.data
      );
    }
  };

  fetchPreviewLogs();
}, []);
useEffect(() => {
  const fetchBloqueios =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "token"
          );

        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`;

        const response =
          await axios.get(
            `${url}/estatisticas-bloqueios-dashboard`
          );

        setDadosBloqueio(
          response.data.data
        );
      } catch (error) {
        console.error(
          "Erro ao buscar estatísticas:",
          error
        );
      }
    };

  fetchBloqueios();
}, []);
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

const trocarMes = (
  direcao
) => {
  setDataAtual((prev) => {
    const novaData =
      new Date(prev);

    novaData.setMonth(
      prev.getMonth() +
        direcao
    );

    return novaData;
  });
};
  const formatarData = (dataIso) => {
    const data = new Date(dataIso);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
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
                        
                      </div>

                      <div
  className={styles.scroll}
  style={{
    height: "520px",
    alignContent: "flex-start",
  }}
>
  {atividades.map((item) => (
    <div
      key={item._id}
      className={styles.contentAtiv}
    >
      <div className={styles.contentInfo}>
        <div className={styles.contentInfo}>
          {getIcon(item?.acao)}
        </div>

        <p>
          <strong>
            {item?.autorNome}
          </strong>{" "}
          {formatarAcao(item?.acao)}
        </p>
      </div>

      <div className={styles.contentInfo}>
        <p>
          {formatarData(item?.dataHora)}
        </p>
      </div>
    </div>
  ))}
</div>


                    </section>

                    <section className={styles.content}>
  <div style={{ width: "100%" }}>
    <p>
      Visão geral de bloqueios
    </p>
  </div>

  <div
    className={
      styles.contentInfoBloq
    }
  >
    <div
      className={
        styles.contentInfo2
      }
    >
      <div
        className={
          styles.contentBloq
        }
      >
        <div
          className={
            styles.containerPe
          }
        />

        <div
          className={
            styles.containerItemVal
          }
        >
          <div
            className={
              styles.containerVal
            }
          >
            <h3
              className={
                styles.textEdit
              }
              style={{
                fontSize:
                  "50px",
              }}
            >
              {dadosBloqueio?.totalBloqueios ??
                0}
            </h3>

            <p
              className={
                styles.textEdit
              }
              style={{
                width: "40px",
                wordWrap:
                  "break-word",
              }}
            >
              Bloq.totais
            </p>
          </div>

          <div
            className={
              styles.containerVal
            }
          >
            <p>
              +
              {
                dadosBloqueio?.variacaoPercentual
              }
              %
            </p>

            <p>
              neste mês
            </p>
          </div>
        </div>
      </div>

      <div
        className={
          styles.contentBloq
        }
      >
        <div
          className={
            styles.containerPe
          }
        />

        <div
          className={
            styles.containerItemVal
          }
        >
          <div
            className={
              styles.containerVal
            }
          >
            <Triangle
              size={30}
              color="#DD5151"
              fill="#DD5151"
              strokeWidth={0}
            />

            <h3
              className={
                styles.textEdit
              }
              style={{
                fontSize:
                  "50px",
              }}
            >
              {
                dadosBloqueio?.variacaoPercentual
              }
              %
            </h3>
          </div>

          <div
            className={
              styles.containerVal
            }
          >
            <p>
              Desde o último
              mês
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      className={
        styles.contentInfoBloqMes
      }
    >
      <div
        className={
          styles.containerValChao
        }
      >
        <h3
          className={
            styles.textEdit
          }
          style={{
            fontSize:
              "50px",
          }}
        >
          {
            dadosBloqueio
              ?.mesAtual
              ?.total
          }
        </h3>

        <p
          className={
            styles.textEdit
          }
        >
          em{" "}
          {
            dadosBloqueio
              ?.mesAtual
              ?.nome
          }
        </p>
      </div>

      <div
        className={
          styles.containerValChao
        }
      >
        <h3
          className={
            styles.textEdit
          }
          style={{
            fontSize:
              "50px",
          }}
        >
          {
            dadosBloqueio
              ?.mesPassado
              ?.total
          }
        </h3>

        <p
          className={
            styles.textEdit
          }
        >
          em{" "}
          {
            dadosBloqueio
              ?.mesPassado
              ?.nome
          }
        </p>
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
    {dias.map((dia, index) => {
  const hoje = new Date();

  const isSelecionado =
    dia.mesAtual &&
    dataSelecionada &&
    dia.numero ===
      dataSelecionada.getDate() &&
    mes ===
      dataSelecionada.getMonth() &&
    year ===
      dataSelecionada.getFullYear();

  const isHoje =
    !isSelecionado &&
    dia.numero ===
      hoje.getDate() &&
    dia.mesAtual &&
    mes ===
      hoje.getMonth() &&
    year ===
      hoje.getFullYear();
      
      return (
        <div
          key={index}
          onClick={() => {
            if (!dia.mesAtual)
              return;

            const novaData =
              new Date(
                year,
                mes,
                dia.numero
              );

            console.log(
              "Selecionado:",
              novaData
            );

            setDataSelecionada(
              novaData
            );
          }}
          className={`${styles.dia}
            ${
              isHoje
                ? styles.hoje
                : ""
            }
            ${
              !dia.mesAtual
                ? styles.diaForaMes
                : ""
            }
            ${
              isSelecionado
                ? styles.diaSelecionado
                : ""
            }
          `}
        >
          {dia.numero}
        </div>
      );
    })}
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
