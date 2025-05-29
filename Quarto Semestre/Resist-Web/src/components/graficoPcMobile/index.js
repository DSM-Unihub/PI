import styles from './grafico.module.css'
import { ComputerDesktopIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

export default function GraficoPcMob() {
    const block = [{
        "tipoBlock": 1,
        "dataHora": 1715395200000,
        "tipoDispo": 1,
        "nomeDispo": "Samsung 2",
        "laboraDisp": "Laboratório 2",
    },
    {
        "tipoBlock": 2,
        "dataHora": 1715395200000,
        "tipoDispo": 2,
        "nomeDispo": "Desktop 1",
        "laboraDisp": "Laboratório 2",
    },
    {
        "tipoBlock": 1,
        "dataHora": 1715395200000,
        "tipoDispo": 2,
        "nomeDispo": "Desktop 10",
        "laboraDisp": "Laboratório 2",
    },
    {
        "tipoBlock": 2,
        "dataHora": 1715395200000,
        "tipoDispo": 1,
        "nomeDispo": "Iphone 2",
        "laboraDisp": "Laboratório 2",
    },
    {
        "tipoBlock": 2,
        "dataHora": 1715395200000,
        "tipoDispo": 1,
        "nomeDispo": "Iphone 2",
        "laboraDisp": "Laboratório 2",
    },
    {
        "tipoBlock": 2,
        "dataHora": 1715395200000,
        "tipoDispo": 1,
        "nomeDispo": "Iphone 2",
        "laboraDisp": "Laboratório 2",
    },
    {
        "tipoBlock": 2,
        "dataHora": 1715395200000,
        "tipoDispo": 1,
        "nomeDispo": "Iphone 2",
        "laboraDisp": "Laboratório 2",
    },
    {
        "tipoBlock": 2,
        "dataHora": 1715395200000,
        "tipoDispo": 1,
        "nomeDispo": "Iphone 2",
        "laboraDisp": "Laboratório 2",
    }

    ]

    const formatarData = (dataIso) => {
        const data = new Date(dataIso);
        const dia = String(data.getDate()).padStart(2, "0");
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    };
    return (

        <section style={{ flex: 1, height: "100%", display: 'flex', flexDirection: 'column' }}>
            <div>
                <p className={styles.stylep}>Últimos Bloqueios na Rede</p>
            </div>
            <div style={{ height: "100%", width: "100%", minWidth: "26.5%", display: 'flex', flexDirection: 'column', marginTop:'10px' }}>

                <div className={styles.cardTipoBloc}>
                    <div className={styles.divTodoTip}>
                        <div className={styles.divUmtipo}>
                            <div className={styles.divTip}></div>
                            <p>Bloq. automático</p>
                        </div >
                        <div className={styles.divUmtipo}>
                            <div style={{ backgroundColor: 'rgba(143, 171, 255, 1)' }} className={styles.divTip}></div>
                            <p>Bloq. manual</p>
                        </div>

                    </div>
                    <div className={styles.for}>
                        {block.map((bloq) => (
                            <div className={styles.forTipo}>
                                <div className={styles.divLinha}>
                                    <div
                                        className={styles.forContainerTipo}
                                        style={{
                                            backgroundColor: bloq.tipoBlock === 1 ? 'rgba(143, 171, 255, 1)' : undefined
                                        }}
                                    />


                                    <div>

                                        {bloq.tipoDispo === 1 ? (
                                            <ComputerDesktopIcon
                                                className={styles.icon}
                                                style={{
                                                    color: bloq.tipoBlock === 1 ? 'rgba(143, 171, 255, 1)' : undefined
                                                }}
                                            />
                                        ) : (
                                            <DevicePhoneMobileIcon
                                                className={styles.icon}
                                                style={{
                                                    color: bloq.tipoBlock === 1 ? 'rgba(143, 171, 255, 1)' : undefined
                                                }}
                                            />
                                        )}


                                    </div>
                                    <div>
                                        <p className={styles.stylep}>{bloq.nomeDispo}</p>
                                        <p className={styles.stylep}>{bloq.laboraDisp}</p>
                                    </div>

                                </div>
                                <div className={styles.data}>
                                    <p className={styles.stylep}>{formatarData(bloq.dataHora)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>

    )
}