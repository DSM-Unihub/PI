import NextAuth from "next-auth";
import Providers from "next-auth/providers";

export default NextAuth({
  providers: [
    // Adicione os provedores de autenticação aqui
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    // Adicione mais provedores se necessário
  ],
  // Defina as opções adicionais aqui, se necessário
});
