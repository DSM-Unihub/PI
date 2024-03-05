/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 */
package com.mycompany.http.get;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;

/**
 *
 * @author mandirad
 */
public class HTTPGET {

    public static void main(String[] args) {
//        url do ultimo site acessado
        String lastUrl = "https://pt.wikipedia.org/wiki/Meme";

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
        }
        return content.toString();
    }
    // Método para indexar o conteúdo textual em um banco de dados

    private static void indexContentinDatabase(String content) {
        // Aqui você pode conectar-se ao banco de dados e indexar o conteúdo,
        // incluindo as tags HTML, conforme necessário.
        System.out.println(content); // Exemplo: apenas imprimindo o conteúdo aqui
    }
}

