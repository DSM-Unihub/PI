
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author fatec-dsm2
 */
public class principal {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
   //        url do ultimo site acessado
        String lastUrl = "https://g1.globo.com/economia/negocios/noticia/2024/03/08/petrobras-perde-bilhoes-em-valor-de-mercado-apos-resultados-de-2023.ghtml";

//        Obter o conteudo textual do site
        String siteContent = scrapeWebSiteContent(lastUrl);

//        Conectar-se ao banco de dados e indexar o conteudo
         indexContentinDatabase(siteContent);
    }
//    Metodo para fazer scraping do conteudo do site
    private static String scrapeWebSiteContent(String url) {
        StringBuilder content = new StringBuilder();
        try {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(new URL(url).openStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    content.append(line).append("\n");
                }
            }
        } catch (IOException e) {
            System.err.println(e);
        }
        return content.toString();
    }
    // Método para indexar o conteúdo textual em um banco de dados

    private static void indexContentinDatabase(String content) {
        // Aqui você pode conectar-se ao banco de dados e indexar o conteúdo,
        // incluindo as tags HTML, conforme necessário.
         Connection con;
        try{ 
            con = DriverManager.getConnection("jdbc:mysql://localhost:3306/teste", "root", "");
            System.out.println("Sucesso");
        }
        catch(SQLException e){
            System.err.println(e);
        }
        System.out.println(content); // Exemplo: apenas imprimindo o conteúdo aqui
    }
}
