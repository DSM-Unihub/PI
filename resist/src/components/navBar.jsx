import { Link } from "react-router-dom"
import { IoHome } from "react-icons/io5";
import resistLogo from '../assets/resist-dark.svg'
import resistLogoText from '../assets/resist-txt-dark.svg'
const NavBar = () => {
    return (
            <div class='bg-gradient-to-r from-bluePrimary to-blueSecondary flex-col'>
                <img src={resistLogo} className="size-12" />
                <img src={resistLogoText} className="size-12" />
                <div>
                    <div className="justify-center align-middle">
                    <Link to='/'><IoHome /></Link>
                    </div>
                    <Link to='estatisticas'><p>Estatisticas</p></Link>
                    <p>Bloqueios</p>
                    <p>Celulares</p>
                </div>
                <p>Computadores</p>
                <div className='self-end bg-orange'>
                    <p>Ajuda</p>
                    <p>Configurações</p>
                    <p>Sair</p>
                </div>
            </div>
    )
}

export default NavBar