import { useState, useEffect } from "react";
import axios from "axios";
import url from "../services/url";
import Image from "next/image";

// Component for Recent Activity
const RecentActivity = () => {
  const [atividades, setAtividades] = useState([])
  const fetchAtividades = async () =>{
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${url}/ultimas-atividades`);
      setAtividades(response.data);
    } catch (error) {
      console.error("Error fetching atividades:", error);
      throw error
    }
  }

  useEffect(() => {
    fetchAtividades();
  }, []);

  return (
    <div className="lg:flex flex-col hidden h-fit bg-azul-principal rounded-xl">
      <div className="flex flex-row justify-between p-2 ">
        <p className="text-white text-base p-3 text-center">
          Atividade recente
        </p>
        <ActivityFilter />
      </div>
      <ActivityList atividades={atividades} />
    </div>
  );
};

export default RecentActivity;

// Component for Activity Filter
function ActivityFilter() {
  return (
    <select className="bg-azul-principal cursor-pointer hover:brightness-75 duration-300 text-white text-base border-white border h-fit self-center">
      <option value="Mes">Este Mês</option>
      <option value="Hoje">Hoje</option>
      <option value="Semana">Esta Semana</option>
    </select>
  );
}

// Component for Activity List
function ActivityList({atividades}) {
  const activityList = atividades
  const [icon, setIcon] = useState("")
  return (
    <div className="bg-white h-fit rounded-b-xl">
      {activityList.map((atividade) => (
            <div key={atividade.data} className="flex flex-row justify-between p-1 items-center">
            <div className="flex flex-row justify-start items-center gap-5">
              <div className="border-2 border-azul-principal rounded-full p-1 xl:p-3">
                <img src="./icons/bloqueio-blue.svg" className="size-4" alt="Activity Icon" />
              </div>
              <p className="text-sm text-azul-text">Novo Bloqueio {atividade.tipoInsercao} realizado </p>
            </div>
            <p className="text-sm text-azul-text">{atividade.data}</p>
          </div>
      ))}
    </div>
  );
}



