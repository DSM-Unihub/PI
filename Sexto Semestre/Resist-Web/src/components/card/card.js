import styles from './card.module.css';

export default function CardInfo({
  titulo,
  subtitulo,
  tipo = "",
  sitPessoa = "",
  dia = "",
  mes = "",
  ano = "",
  tiposList = [],
  statusList = [],
  onTipoChange = () => {},
  onSitPessoaChange = () => {},
  onDiaChange = () => {},
  onMesChange = () => {},
  onAnoChange = () => {},
  view,
}) {
  return (
    <section className={styles.body}>
      <section className={styles.cardes}>
        <div className={styles.wrapper}>
          <div className={styles.card}>
            <p>{titulo}</p>
            <h4>{subtitulo}</h4>
          </div>
        </div>

        {view === true && (
          <div className={styles.Filterwrapper}>
            <div className={styles.FilterCard}>
              <div className={styles.Filtercard}>
                <select value={tipo} onChange={(e) => onTipoChange(e.target.value)}>
                  <option value="">Todos os tipos</option>
                  {tiposList.map((item, index) => (
                    <option key={index} value={item.value || item}>
                      {item.label || item}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.Filtercard}>
                <select value={sitPessoa} onChange={(e) => onSitPessoaChange(e.target.value)}>
                  <option value="">Todos status</option>
                  {statusList.map((item, index) => (
                    <option key={index} value={item.value || item}>
                      {item.label || item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.FilterCard}>
              <div className={styles.Filtercard}>
                <input
                  type="number"
                  placeholder="Dia"
                  value={dia}
                  onChange={(e) => onDiaChange(e.target.value)}
                />
              </div>
              <div className={styles.Filtercard}>
                <input
                  type="number"
                  placeholder="Mês"
                  value={mes}
                  onChange={(e) => onMesChange(e.target.value)}
                />
              </div>
              <div className={styles.Filtercard}>
                <input
                  type="number"
                  placeholder="Ano"
                  value={ano}
                  onChange={(e) => onAnoChange(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}
      </section>

      <section className={styles.cardes}></section>
    </section>
  );
}
