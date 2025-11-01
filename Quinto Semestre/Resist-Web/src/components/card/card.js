import { ChevronDown } from 'lucide-react';
import styles from './card.module.css';

export default function CardInfo({ titulo, subtitulo, tipo, sitPessoa, dia, mes, ano,view }) {
  return (
    <section className={styles.body}>
      <section className={styles.cardes}>
        <div className={styles.wrapper}>
          <div className={styles.card}>
            <p className="">{titulo}</p>
            <h4 className="">{subtitulo}</h4>
          </div>
        </div>
      {view == true && (
  <div className={styles.Filterwrapper}>
    <div className={styles.FilterCard}>
      <div className={styles.Filtercard}>
        <p>{tipo}</p>
        <ChevronDown />
      </div>
      <div className={styles.Filtercard}>
        <p>{sitPessoa}</p>
        <ChevronDown />
      </div>
    </div>

    <div className={styles.FilterCard}>
      <div className={styles.Filtercard}>
        <p>{dia}</p>
      </div>
      <div className={styles.Filtercard}>
        <p>{mes}</p>
      </div>
      <div className={styles.Filtercard}>
        <p>{ano}</p>
      </div>
    </div>
  </div>
)}

      </section>
      <section className={styles.cardes}>

      </section>
    </section>
  );
}
