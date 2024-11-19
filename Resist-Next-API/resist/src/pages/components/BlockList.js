import { useState, useEffect } from "react";
import url from "../services/url";
import axios from "axios";

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
      const response = await axios.get(`${url}/bloqueios`);
      setBloqueios(response.data);
    } catch (error) {
      console.error("Error fetching bloqueios:", error);
    }
  };

  // Função para confirmar e executar o toggle
  const handleToggleConfirm = async () => {
    if (!selectedBloqueio) return;

    try {
      const response = await axios.put(`${url}/bloqueios/${selectedBloqueio._id}`, {
        flag: !selectedBloqueio.flag
      });
      
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
    <div className="flex flex-col overflow-x-auto">
      <div className="flex flex-row justify-between pb-1 ">
        <h3 className="text-azul-text text-lg font-bold">
          Editar bloqueios de URL
        </h3>
        <div className="flex flex-row justify-center items-center gap-2">
          <button className="rounded  text-white  p-1 px-2 bg-azul-buttom">
            <img src="/icons/edit.svg" />
          </button>
          <button className="rounded  text-white  p-1 px-2 bg-azul-buttom">
            <img src="/icons/delete.svg" />
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl p-2 gap-5 overflow-y-scroll max-h-96">
        <table className="table-auto w-full">
          <thead className="border-b border-black">
            <tr className="text-azul-text">
              <th className="border-b border-black">URL Bloqueado</th>
              <th className="border-b border-black">Data</th>
              <th className="border-b border-black">Tipo Bloq.</th>
              <th className="border-b border-black">Status</th>
              <th className="p-2 border-b border-black">Ações</th>
            </tr>
          </thead>
          <tbody className="text-azul-text">
            {bloqueios.map((bloq) => (
              <tr key={bloq._id} className="justify-self-center border-black">
                <td className="p-2 font-bold border-b border-black overflow-hidden text-ellipsis whitespace-nowrap max-w-xs">
                  {bloq.urlWeb}
                </td>
                <td className="p-2 text-nowrap border-b border-black">
                  {formatarData(bloq.dataHora)}
                </td>
                <td className="p-2 font-bold border-b border-black">
                  {bloq.tipoInsercao}
                </td>
                <td className="p-2 border-b border-black">
                  <span className={`px-2 py-1 rounded ${bloq.flag ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {bloq.flag ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="p-2 border-b border-black">
                  <select 
                    className="w-full p-1 rounded border"
                    onChange={(e) => {
                      if (e.target.value === 'toggle') {
                        handleStatusChange(bloq);
                      }
                      e.target.value = ''; // Reset select após uso
                    }}
                  >
                    <option value="">Selecione...</option>
                    <option value="toggle">Alterar Status</option>
                    <option value="details">Detalhes</option>
                  </select>
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
              Deseja alterar o status do bloqueio para {selectedBloqueio?.flag ? 'inativo' : 'ativo'}?
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
