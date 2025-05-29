import Image from "next/image";
import styles from './headerBar.module.css'
export default function HeaderBar({ usuario }) {
  return (
    <div className={styles.headerContainer}>

      <div className={styles.busca}>
        <input
          type="text"
          name="pesquisa"
          placeholder="Pesquisar"
          className={styles.inputBusca}
        />
        {/* Icons */}
        

          <div className={styles.headerIcon}>
            <img alt="" className="size-6" src="/icons/blog.svg" />
          </div>
          <div className={styles.headerIcon}>
            <img alt="" className="size-6" src="/icons/notificacao.svg" />
          </div>
        </div>
        
      {/* Perfil */}
      <div className={styles.person}>
        <div className={styles.personText}>
          <p>
            {usuario?.nome || "Usuário"}  
          </p>
          <p>{usuario?.permissoes.join(", ")}</p>
        </div>
        <div className={styles.divimgPerson}>
          <img
            // alt="Foto de perfil"
            className={styles.imgPerson}
            src={usuario?.foto || "/icons/default-profile.svg"}
          />
        </div>
      </div>
    </div>
  );
}
