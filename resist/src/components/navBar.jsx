import { Link } from "react-router-dom"
import Home from '../assets/icons/home.png'
import Arrow from '../assets/icons/arrow.svg'
import Celular from '../assets/icons/celular.svg'
import Computador from '../assets/icons/computador.svg'
import Definicoes from '../assets/icons/definicoes.svg'
import Inter from '../assets/icons/interrogatorio.svg'
import resistLogo from '../assets/resist-dark.svg'
import Sair from '../assets/icons/sair-alt.svg'
import Block from '../assets/icons/trancar.svg'
import resistLogoText from '../assets/resist-txt-dark.svg'
const NavBar = () => {
    return (
        <div class='flex flex-initial flex-col p-4 bg-gradient-to-r from-bluePrimary to-blueSecondary '>
            <div className="justify-center">
                <img src={resistLogo} className="sm:size-20 md:size-32 lg:size-60" />
                <img src={resistLogoText} className="sm:size-20 md:size-32 lg:size-60" />
                <Link to='/'><img src={Home} className="size-8" /></Link>
                <Link to='estatisticas'><p><img src={Arrow} className="size-8" /></p></Link>
                <img src={Block} className="size-8" />
                <img src={Celular} className="size-8" />
                <img src={Computador} className="size-8" />
            </div>
            <div className="">
                <img src={Inter} className="size-8" />
                <img src={Definicoes} className="size-8 stroke-grayPrimary" />
                <img src={Sair} className="size-8" />
            </div>
        </div>
    )
}

export default NavBar