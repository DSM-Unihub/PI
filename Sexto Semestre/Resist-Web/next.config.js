/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',       // quando acessar /
        destination: '/index', // redireciona para /index
        permanent: true,   // true = 308 permanente, false = 307 temporário
      },
    ]
  },
}

module.exports = nextConfig