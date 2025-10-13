import styles from './card.module.css';

export default function CardInfo({ titulo, subtitulo }) {
  return (
    <section className={styles.body}>
      <section className={styles.cardes}>
        <div className={styles.wrapper}>
          <div className={styles.card}>
            <p className="">{titulo}</p>
            <h4 className="">{subtitulo}</h4>
          </div>
        </div>
      </section>
      <section  className={styles.cardes}>

      </section>
    </section>
  );
}
