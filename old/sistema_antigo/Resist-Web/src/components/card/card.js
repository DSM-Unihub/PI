import styles from './card.module.css';

export default function CardInfo({ titulo, subtitulo }) {
  return (
    <section >
        <div className={styles.wrapper}>
      <div className={styles.card}>
        <p className="">{titulo}</p>
        <h4 className="">{subtitulo}</h4>
      </div>
    </div>
    </section>
    
  );
}
