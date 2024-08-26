import HeaderBar from "./partials/headerBar";
import NavBar from "./partials/navBar";

export default function Index() {
  return (
    <section className="flex flex-row justify-start h-screen bg-gradient-to-tr from-cinza-secundario to-cinza-principal w-full h-full">
      <section className="hidden md:flex bg-gradient-to-b from-azul-principal to-azul-nav-fim  flex-col p-5 h-screen gap-10">
        <NavBar />
      </section>
      <section className="flex flex-col w-full lg:overflow-hidden">
        <section className="flex flex-row items-center justify-between h-fit p-6 md:gap-2 lg:gap-32">
          <div className="flex flex-row items-center gap-2 lg:gap-5 w-full max-w-7xl">
            <HeaderBar />
          </div>
        </section>
      </section>
    </section>
  );
}
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}