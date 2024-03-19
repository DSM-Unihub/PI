
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author mandirad
 */
public class scrapSiteContent {
    private String url;
    private String conteudo;
    public scrapSiteContent(){
        this("","");
    }

    public scrapSiteContent(String url, String conteudo) {
        this.url = url;
        this.conteudo = conteudo;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }
    
    public String content(){
        //    Metodo para fazer scraping do conteudo do site

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
}
