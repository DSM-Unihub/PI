import { Link } from "react-router-dom"
import Home from '../assets/icons/Home.svg'
import Arrow from '../assets/icons/Stats.svg'
import Celular from '../assets/icons/Celular.svg'
import Computador from '../assets/icons/PC.svg'
import Definicoes from '../assets/icons/Configs.svg'
import Inter from '../assets/icons/Ajudamenu.svg'
import resistLogo from '../assets/resist-dark.svg'
import Sair from '../assets/icons/Logout.svg'
import Block from '../assets/icons/Bloqueios.svg'
import resistLogoText from '../assets/resist-txt-dark.svg'
const NavBar = () => {
    return (
        <div class='flex flex-initial flex-col gap-48 p-4 bg-gradient-to-r from-bluePrimary to-blueSecondary '>
            <div className="justify-center ">

                <img src={resistLogo} className="size-8 sm:size-12 md:size-16 lg:size-16" />
                <img src={resistLogoText} className="size-8 sm:size-12 md:size-16 lg:size-16" />
                <Link to='/'><img src={Home} className="size-6 sm:size-10 md:size-14 lg:size-14 my-3 rounded-s-full bg-contain bg-grayPrimary" /></Link>
                <Link to='estatisticas'><p><img src={Arrow} className="size-6 sm:size-10 md:size-14 lg:size-14 my-3 hover:bg-blueSecondary" /></p></Link>
                <img src={Block} className="size-6 sm:size-10 md:size-14 lg:size-14 my-3 hover:bg-blueSecondary" />
                <img src={Celular} className="size-6 sm:size-10 md:size-14 lg:size-14 my-3 hover:bg-blueSecondary" />
                <img src={Computador} className="size-6 sm:size-10 md:size-14 lg:size-14 my-3 hover:bg-blueSecondary" />
            </div>
            <div className="">
                <img src={Inter} className="size-6 sm:size-10 md:size-14 lg:size-14 my-3 hover:bg-blueSecondary" />
                <img src={Definicoes} className="size-6 sm:size-10 md:size-14 lg:size-14 my-3 hover:bg-blueSecondary stroke-grayPrimary" />
                <img src={Sair} className="size-6 sm:size-10 md:size-14 lg:size-14 my-3 hover:bg-blueSecondary" />
            </div>
        </div>
    )
}

export default NavBar