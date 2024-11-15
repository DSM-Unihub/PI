import { useState, useEffect } from "react";
import url from "../services/url";
import axios from "axios";
const BlockList = () => {
  const [bloqueios, setBloqueios] = useState([]);

  const fetchBloqueios = async()=>{
    try{
      const response = await axios.get(`${url}/bloqueios`)
      setBloqueios(response.data)

    }catch(error){
      console.error("Error fetching bloqueios:", error);
    }
  }

  useEffect(()=>{
    fetchBloqueios()
  }, [])
  return (
    <div className="Flex flex-col">
      <div className="flex flex-row justify-between pb-1 ">
        <h3 className="text-azul-text text-lg font-bold">
          Editar bloqueios de URL
        </h3>
        <div className="flex flex-row justify-center items-center gap-2">
          <button
            onclick="ordenarURLs()"
            className="rounded  text-white  px-3 py-1 bg-azul-buttom"
          >
            Ordenar URL's
          </button>
          <button className="rounded  text-white  p-1 px-2 bg-azul-buttom">
            <img src="/icons/edit.svg" />
          </button>
          <button className="rounded  text-white  p-1 px-2 bg-azul-buttom">
            <img src="/icons/delete.svg" />
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl p-2 gap-5 overflow-y-scroll max-h-96">
        <table className="table-auto w-full ">
          <thead className="border-b border-black" >
            <tr className="text-azul-text ">
              <th className="border-b border-black">URL Bloqueado</th>
              <th className="border-b border-black">Data</th>
              <th className="border-b border-black">Tipo Bloq.</th>
              <th className="p-2 border-b border-black">Selec./Editar</th>
            </tr>
          </thead>
          <tbody className="text-azul-text">
            {bloqueios.map((bloq) => (
              <tr className="  justify-self-center  border-black">
                <td className="p-2 font-bold border-b border-black">{bloq.urlWeb}</td>
                <td className="p-2 text-nowrap  border-b border-black">{bloq.dataHora}</td>
                <td className="p-2 font-bold border-b border-black">{bloq.tipoInsercao}</td>
                <td className="grid grid-cols-2 p-2 border-b border-black">
                  <input className="cursor-pointer" type="checkbox" name="select" />
                  <select className="w-8">
                    <option className="" value="">
                    </option>
                    <option value="details">Detalhes</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlockList;
