import Image from "next/image";
<<<<<<< HEAD:DW3/Site/resist/src/app/page.js
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
=======
import Index from "../../components/index";
export default function Home() {
  return (
    <main>
      <Index/>
>>>>>>> 268c361 (Inicio Tela Login):DW3/Site/resist/src/app/page.jsx
    </main>
  );
}
