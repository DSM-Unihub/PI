import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

const BlockPage = () => {
  const [site, setSite] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const siteParam = params.get('site') || 'https://bloqueado.com';
    setSite(siteParam);

    QRCode.toDataURL(siteParam, {
      color: {
        light: '#00000000' // Transparent background
      }
    })
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error('Erro ao gerar QRCode:', err));
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      height: '100vh',
      fontFamily: 'Arial, sans-serif',
      color: '#2B438D',
    }}>
      {/* Coluna esquerda - QR Code */}
      <div style={{
        width: '30%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        borderRight: '1px solid #ccc',
      }}>
        <p style={{ fontSize: '1.6rem', marginBottom: '1rem', textAlign:'center' }}>
          Leia o <strong>QR Code</strong> abaixo em nosso aplicativo
          caso queira sugerir o desbloqueio desta página:
        </p>
        {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" style={{ width: 250, height: 250 }} />}
      </div>

      {/* Coluna direita - Mensagem de bloqueio */}
      <div style={{
        width: '70%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '2rem',
        marginInline:30
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          ⚠️ <strong>Erro</strong>
        </h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          A URL requisitada não pode ser acessada.
        </p>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          O acesso à página: <em>{site}</em> foi <strong>negado</strong>.
        </p>
        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
          Este site pode possuir conteúdo de discurso de ódio.
          Neste caso, <strong>corridas</strong>. Portanto, foi bloqueado automaticamente pelo <strong>ReSist</strong>.
        </p>
        <p style={{ fontSize: '1.1rem' }}>
          Procure o responsável pela administração do sistema.
        </p>

        <div style={{ marginTop: '3rem', fontSize: '0.9rem', color: '#2B438D' }}>
          Verificado em 28/05/2025
        </div>

        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#999', textAlign:'end', verticalAlign:'bottom' }}>
          Powered by <span style={{ color: '#E75F42' }}>UniHub</span>
        </div>
      </div>
    </div>
  );
};

export default BlockPage;
