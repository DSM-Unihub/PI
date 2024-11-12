const BlockList = () => {
  const bloqueios = [
    {
      url: "https://example.com",
      dataHora: "2022-01-01",
    },
    {
      url: "https://example.com",
      dataHora: "2022-01-01",
    },
    {
      url: "https://example.com",
      dataHora: "2022-01-01",
    },
    {
      url: "https://example.com",
      dataHora: "2022-01-01",
    },
    {
      url: "https://example.com",
      dataHora: "2022-01-01",
    },
    {
      url: "https://example.com",
      dataHora: "2022-01-01",
    },
    {
      url: "https://example.com",
      dataHora: "2022-01-01",
    },
    {
      url: "https://example.com",
      dataHora: "2022-01-01",
    },
    {
      url: "https://example.com",
      dataHora: "2022-01-01",
    },
    {
      url: "https://example.com",
      dataHora: "2022-01-01",
    },
  ];
  return (
    <div class="Flex flex-col">
      <div class="flex flex-row justify-between pb-1 ">
        <h3 class="text-azul-text text-lg font-bold">
          Editar bloqueios de URL
        </h3>
        <div class="flex flex-row justify-center items-center gap-2">
          <button
            onclick="ordenarURLs()"
            class="rounded  text-white w-max px-3 py-1 bg-azul-buttom"
          >
            Ordenar URL's
          </button>
          <button class="rounded  text-white w-max p-1 px-2 bg-azul-buttom">
            <img src="/icons/edit.svg" />
          </button>
          <button class="rounded  text-white w-max p-1 px-2 bg-azul-buttom">
            <img src="/icons/delete.svg" />
          </button>
        </div>
      </div>
      <div class="bg-white rounded-xl w-max p-5 gap-5 overflow-y-scroll max-h-96">
        <table class="table-auto w-full border-separate border-spacing-2 ">
          <thead>
            <tr class="text-azul-text">
              <th>Tipo Disp.</th>
              <th>URL Bloqueado</th>
              <th>Data</th>
              <th>Tipo Bloq.</th>
              <th>Selec./Editar</th>
            </tr>
          </thead>
          <tbody class="text-azul-text">
            {bloqueios.map((bloq) => (
              <tr class="bloqueio-row border-b justify-self-center  ">
                <td class=" flex flex-col items-center justify-center">
                  <img src="/icons/iconDesktop.svg" />
                </td>
                <td class="url font-bold">{bloq.url}</td>
                <td>{bloq.dataHora}</td>
                <td class="font-bold">Automático</td>
                <td class="grid grid-cols-2">
                  <input class="cursor-pointer" type="checkbox" name="select" />
                  <select>
                    <option class="rotate-180" value="">
                      ^
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
