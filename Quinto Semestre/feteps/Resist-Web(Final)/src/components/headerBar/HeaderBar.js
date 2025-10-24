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
        
<div className={styles.headerIcons}>
  <div className={styles.headerIcon}>
            <img alt="" className="size-6" src="/icons/blog.svg" />
          </div>
          <div className={styles.headerIcon}>
            <img alt="" className="size-6" src="/icons/notificacao.svg" />
          </div>
        </div>
</div>
          
        
      {/* Perfil */}
      <div className={styles.person}>
        <div className={styles.personText}>
          <p>
            {usuario?.nome || "Usuário"}  
          </p>
          <p>{usuario?.permissoes}</p>
        </div>
        <div className={styles.divimgPerson}>
          <img
            // alt="Foto de perfil"
            className={styles.imgPerson}
            src={usuario?.foto || "https://media.licdn.com/dms/image/v2/D4D03AQEpoIm7LaRfFg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1711635621492?e=1762387200&v=beta&t=yMIrn7gLtRqflItJA-_G0_PeA7ipTqWyu34f5_rdN4E"}
          />
        </div>
      </div>
    </div>
  );
}
