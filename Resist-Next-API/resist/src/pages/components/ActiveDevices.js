const ActiveDevices = () => {
  const data = [
    {
      id: 0,
      nome: "Laboratorio 01",
      quantidade: 100,
      status: "Ativo",
    },
    {
      id: 1,
      nome: "Laboratorio 02",
      quantidade: 35,
      status: "Desativo",
    },
    {
      id: 2,
      nome: "Laboratorio 03",
      quantidade: 150,
      status: "Ativo",
    },
    {
      id: 3,
      nome: "Laboratorio 04",
      quantidade: 200,
      status: "Ativo",
    },
    {
      id: 4,
      nome: "Laboratorio 05",
      quantidade: 75,
      status: "Desativo",
    },
    {
      id: 5,
      nome: "Laboratorio 06",
      quantidade: 50,
      status: "Ativo",
    },
  ];
  return (
    <>
      <div className="component-container overflow-y-auto lg:h-52 lg:rounded-xl">
        <h2 className="title">Ativos Agora</h2>
        <div className="flex flex-col items-center justify-center self-center md:self-start p-4 md:p-1 bg-white rounded-xl">
          <table className="text-center ">
            <thead className=" text-azul-title font-bold text-base">
              <tr>
                <th>Nome</th>
                <th>Qtde. Disp.</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="">
              {data.map((dados) => (
                <tr key={dados.id} className="border-b border-separate">
                  <td>{dados.nome}</td>
                  <td>{dados.quantidade}</td>
                  <td>
                    <img src={``} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ActiveDevices;
