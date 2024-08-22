import Image from "next/image";
import Header from "@/components/partials/headerBar";
import NavBar from "@/components/partials/navBar";
export default function Home() {
  return (
    <main>
      <section class="flex flex-row justify-start h-screen bg-gradient-to-tr from-cinza-secundario to-cinza-principal w-full h-full">
          <NavBar />
        <section class="flex flex-col w-full lg:overflow-hidden">
              <Header />
        </section>
      </section>
    </main>
  );
}
