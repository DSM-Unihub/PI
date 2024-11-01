// Component for Recent Activity
const RecentActivity = () => {
  return (
    <div className="lg:flex flex-col hidden h-fit bg-azul-principal rounded-xl">
      <div className="flex flex-row justify-between p-2 ">
        <p className="text-white text-base p-3 text-center">
          Atividade recente
        </p>
        <ActivityFilter />
      </div>
      <ActivityList />
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
function ActivityList() {
  const activities = [
    {
      text: "Novo bloqueio realizado automaticamente pelo sistema",
      date: "22/03/24",
      icon: "/icons/bloqueio-blue.svg",
    },
    {
      text: "Novo dispositivo desktop cadastrado",
      date: "22/03/24",
      icon: "/icons/PC-blue.svg",
    },
    {
      text: "Nova exceção adicionada manualmente",
      date: "21/03/24",
      icon: "/icons/plus-blue.svg",
    },
    {
      text: "Novo dispositivo móvel cadastrado",
      date: "20/03/24",
      icon: "/icons/Celular-blue.svg",
    },
    {
      text: "Novo usuário criado pelo administrador",
      date: "17/03/24",
      icon: "/icons/user-blue.svg",
    },
  ];

  return (
    <div className="bg-white h-fit rounded-b-xl">
      {activities.map((activity, index) => (
        <ActivityItem key={index} activity={activity} />
      ))}
    </div>
  );
}

// Component for individual Activity Item
function ActivityItem({ activity }) {
  return (
    <div className="flex flex-row justify-between p-1 items-center">
      <div className="flex flex-row justify-start items-center gap-5">
        <div className="border-2 border-azul-principal rounded-full p-1">
          <img src={activity.icon} className="size-4" alt="Activity Icon" />
        </div>
        <p className="text-sm text-azul-text">{activity.text}</p>
      </div>
      <p className="text-sm text-azul-text">{activity.date}</p>
    </div>
  );
}
