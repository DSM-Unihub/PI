import Chart from "chart.js/auto";
import { useRef, useEffect, useState } from "react";
const Incidencia = () => {
  data=[{index: 0, value:}]
  const chartRef = useRef(null);
  useEffect(() => {
    const ctx = document.getElementById("LaboratorioTeste").getContext("2d");
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const [currentIndex, setCurrentIndex] = useState(0)
    const [numItemsShow, setNumItemsShow] = useState(4)
    const carouselRef = useRef(null);
    const startXRef = useRef(0);

    const handleSlideChange = (direction) =>{
      if(direction === "prev"){
        setCurrentIndex((prevIndex) =>{
          prevIndex === 0 ? data.lenght -1 : prevIndex - 1
        })
      } else{
        setCurrentIndex((prevIndex) =>(prevIndex +1) % data.lenght)
      }
    }

    const handleDragStart = (event) => {
      startXRef.current = event.clientX || event.touches[0].clientX
      document.addEventListener("mouseup", handleDragEnd)
      document.addEventListener("touchend", handleDragEnd)
    }

    const handleDragEnd = (event) => {
      document.removeEventListener("mouseup", handleDragEnd)
      document.removeEventListener("touchend", handleDragEnd)

      const currentX = event.ClientX || event.changeTouches[0].clientX
      const deltaX = currentX - startXRef.current
      const threshold = carouselRef.current.offsetWith * 0.2

      if (deltaX > threshold){
        handleSlideChange("prev")
      }else if (deltaX < -threshold){
        handleSlideChange("next")
      }
    }


    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            label: "Lab - Laboratorio Teste",
            data: [100 - 50, 50],
            borderWidth: 1,
            backgroundColor: ["#DEE4F7", "#F23A13"],
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false, // Oculta a legenda
          },
          tooltip: {
            enabled: false, // Desabilita as dicas de ferramentas
          },
        },
        cutout: "65%", // Define a porcentagem de corte
      },
    });
  }, []);
  return (
    <>
      {/* Graficos de Incidencia por sala */}
      <div class=" flex flex-col gap-4 justify-self-center ">
        <p class="text-base text-start text-azul-cinza-escuro">
          Nível de incidência por laboratório
        </p>
        <div className="flex flex-row gap-4">
          {/* Graficos */}
          <div class="flex flex-row gap-3"
          ref={carouselRef}
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}>
            {/* Lab */}
            {[...data, ...data, ...data].slice(currentIndex, currentIndex + numItemsShow).map((dados, index)=>(            <div class="bg-azul-principal rounded-xl h-max" >
              <p class="text-white text-base p-3 text-center">
                Laboratorio Teste
              </p>
              {/* canvas */}
              <div class="bg-white h-max rounded-b-xl flex flex-row justify-center items-center p-2 relative">
                <canvas id="LaboratorioTeste" class="w-max max-h-40"></canvas>
                <p class="text-azul-text text-xl absolute z-10">50%</p>
              </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default Incidencia;
