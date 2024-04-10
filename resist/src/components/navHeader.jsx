import { Link } from "react-router-dom";
import globo from '../assets/icons/globo.svg'
import sino from '../assets/icons/sino.svg'
import perfil from '../assets/perfil.jpg'
const navHeader = () => {
    return (
        <div className="flex flex-row bg-grayPrimary ">
            <input type="text" placeholder="Pesquisar" className="lg:w-96" />
            <img src={globo} className="size-4 sm:size-6 md:size-8 lg:size-10" />
            <img src={sino} className="size-4 sm:size-6 md:size-8 lg:size-10" />
            <p>Caio Bronescheki <br />
                Usuario Business</p>
            <img src={perfil} className="size-16 rounded-lg" />
        </div>
    )
}
export default navHeader