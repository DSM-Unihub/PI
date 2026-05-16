import { useState, useEffect } from "react";
import url from "../services/url";
import axios from "axios";
import Image from "next/image";

const BlockList = () => {
  const [bloqueios, setBloqueios] = useState([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedBloqueio, setSelectedBloqueio] = useState(null);

  // Formatar data para o formato desejado (DD/MM/YYYY)
  const formatarData = (dataIso) => {
    const data = new Date(dataIso);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  // Função para buscar os bloqueios (agora sem filtro de flag)
  const fetchBloqueios = async () => {
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${url}/bloqueios`);
      setBloqueios(response.data);
    } catch (error) {
      console.error("Error fetching bloqueios:", error);
    }
  };

  // Função para deletar uma indexacao
  const handleDeleteIndexacao = async (bloqueioId) => {
    if(window.confirm("Tem certeza que deseja excluir este bloqueio?")) {
      try {
        const token = localStorage.getItem("token");
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.delete(`${url}/bloqueios/${bloqueioId}`);
        if(response.status === 204) {
          alert("Indexação excluída com sucesso!");
          fetchBloqueios(); // Atualiza a lista após excluir
        } else {
          alert("Erro ao excluir a indexação!");
        }
      } catch (error) {
        console.error("Error deleting indexacao:", error);
        alert("Erro ao excluir a indexação!");
      }
    }
  };

  // Função para confirmar e executar a troca de status
  const handleToggleConfirm = async () => {
    if (!selectedBloqueio) return;
    try {
      const token = localStorage.getItem("token");
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.put(
        `${url}/bloqueios/${selectedBloqueio._id}`,
        {
          flag: !selectedBloqueio.flag,
        }
      );

      if (response.data.success) {
        fetchBloqueios();
      }
    } catch (error) {
      console.error("Erro ao atualizar bloqueio:", error);
      alert("Erro ao atualizar o status do bloqueio");
    } finally {
      setShowConfirmDialog(false);
      setSelectedBloqueio(null);
    }
  };

  // Função para abrir o diálogo de confirmação
  const handleStatusChange = (bloqueio) => {
    setSelectedBloqueio(bloqueio);
    setShowConfirmDialog(true);
  };

  useEffect(() => {
    fetchBloqueios();
  }, []);

  return (
    <div className="flex flex-col overflow-x-auto col-span-2">
      <div className="flex flex-row justify-between pb-1 ">
        <h3 className="text-azul-text text-lg font-bold">
          Editar bloqueios de URL
        </h3>
      </div>
      <div className="bg-white rounded-xl p-2 gap-5 overflow-y-scroll max-h-100 lg:max-h-96">
        <table className="table-auto w-full">
          <thead className="border-b border-black">
            <tr className="text-azul-text">
              <th className="border-b border-black">URL Bloqueado</th>
              <th className="border-b border-black">Data</th>
              <th className="border-b border-black">Tipo Bloq.</th>
              <th className="border-b border-black">Status</th>
              <th className="border-b border-black">Ações</th>
            </tr>
          </thead>
          <tbody className="text-azul-text">
            {bloqueios.map((bloq) => (
              <tr key={bloq._id} className="justify-self-center border-black">
                <td className="text-sm p-1 font-bold border-b border-black overflow-hidden text-ellipsis whitespace-nowrap max-w-60">
                  {bloq.urlWeb}
                </td>
                <td className="text-sm p-1 text-nowrap border-b border-black">
                  {formatarData(bloq.dataHora)}
                </td>
                <td className=" text-sm p-1 font-bold border-b border-black">
                  {bloq.tipoInsercao}
                </td>
                <td className=" text-sm p-1  border-b border-black">
                  <span
                    className={`px-2 py-1 rounded ${
                      bloq.flag
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {bloq.flag ? "Bloqueado" : "Desbloqueado"}
                  </span>
                </td>
                <td className="p-1 border-b border-black">
                  <div className="flex flex-row justify-center items-center gap-2">
                    <button
                      className="rounded lg:px-2 lg:py-1  text-white bg-azul-buttom"
                      onClick={(e) => {
                        handleStatusChange(bloq);
                      }}
                    >
                      <img alt="" className="size-6" src="/icons/edit.svg" />
                    </button>
                    <button className="rounded lg:px-2 lg:py-1  text-white bg-azul-buttom"
                      onClick={()=> handleDeleteIndexacao(bloq._id)}
                    >
                      <img alt="" className="size-6  " src="/icons/delete.svg" />
                    </button>
                  </div>
      
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Confirmação */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold mb-4">Confirmar Alteração</h3>
            <p>
              Deseja alterar o status do bloqueio para{" "}
              {selectedBloqueio?.flag ? "desbloqueado" : "bloqueado"}?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-azul-buttom text-white rounded"
                onClick={handleToggleConfirm}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockList;
