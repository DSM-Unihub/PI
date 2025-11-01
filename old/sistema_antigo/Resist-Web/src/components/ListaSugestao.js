import { useState, useEffect } from "react";
import url from "../services/url";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
const teste =[{
  "idUser": 1,
  "dataHora": "1715395200000",
  "url":"https",
  "motivo":"preto",
  "tipo":"Preto",
  "situacao":true,
  "foto":"preto"
},
{ "idUser": 1,
  "dataHora": "1715395200000",
  "url":"https",
  "motivo":"preto",
  "tipo":"Preto",
  "situacao":true,
  "foto":"preto"}
]

const ListSujestao = () => {
  const [sugestao, setsugestao] = useState([]);
  const router = useRouter();
  // Formatar data para o formato desejado (DD/MM/YYYY)
  const formatarData = (dataIso) => {
    const data = new Date(dataIso);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  // Função para buscar as sugestao 

  
  useEffect(() => {
    const listarSugestao = async ()=> {
      try{
        const resposta = await axios.get(`${url}/sugestao`)
        setsugestao(resposta.data)
      }catch(error){
      console.log(error)
    }
    }
    listarSugestao();
  },[]);

  const handleEdit = (sugestao) =>{
    router.push({
      pathname: "DetalhesSuges/detalhesSuges",
      query:{id:sugestao._id}
    })
  }

  return (
    <div className="flex flex-col overflow-x-auto col-span-3">
      <div className="flex flex-row justify-between pb-1 ">
        <h3 className="text-azul-text text-lg font-bold">
        Sugestões de bloqueio e desbloqueio recebidas
        </h3>
      </div>
      <div className="bg-white rounded-xl p-2 gap-5 overflow-y-scroll max-h-100 lg:max-h-96 w-full">

        <table className="table-auto w-full">
          <thead className="border-b border-black">
            <tr className="text-azul-text">
              <th className="border-b border-black">URL Bloqueado</th>
              <th className="border-b border-black">Data</th>
              <th className="border-b border-black">Motivo informado</th>
              <th className="border-b border-black">Tipo de solicitação</th>
              <th className="border-b border-black">Situação</th>
            </tr>
          </thead>
          <tbody className="text-azul-text">
  {sugestao.map((bloq) => (
    <tr
      onClick={() => handleEdit(bloq)} // `/detalhes/${bloq._id}`
      className="border-b border-black text-sm text-center cursor-pointer hover:bg-blue-100 transition-colors"
    >
      <td className="p-2 font-bold max-w-60 overflow-hidden text-ellipsis whitespace-nowrap">
        {bloq.url}
      </td>
      <td className="p-2 whitespace-nowrap">
        {formatarData(bloq.dataHora)}
      </td>
      <td className="p-2 font-bold">
        {bloq.motivo}
      </td>
      <td className="p-2">
        {bloq.tipo}
      </td>
      <td className="p-2">
        {bloq.situacao ? "Bloqueado" : "Desbloqueado"}
      </td>
      
    </tr>
  ))}
</tbody>


        </table>
      </div>
    </div>
  );
};

export default ListSujestao;
