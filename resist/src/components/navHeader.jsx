import { Link } from "react-router-dom";

const navHeader =()=>{
return(
    <div className="flex flex-initial px-10 py-5 flex-row">
        <div className="flex justify-between">
        <input type="text" placeholder="Pesquisar" className="w-60"/>
        <p>globo</p>
        <p>sino</p>
        </div>
        <div className=" gap-10 flex flex-row content-end">
            <p>Usuario</p>
            <p>Foto usuario</p>
        </div>
    </div>
)
}
export default navHeader