/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author Daniel Mandira
 */
public class principal {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        //        url do ultimo site acessado
        String lastUrl = "https://g1.globo.com/economia/negocios/noticia/2024/03/08/petrobras-perde-bilhoes-em-valor-de-mercado-apos-resultados-de-2023.ghtml";

//        Obter o conteudo textual do site
        scrapSiteContent content = new scrapSiteContent();
        content.setUrl(lastUrl);

        String siteContent = content.content();

//        Conectar-se ao banco de dados e indexar o conteudo
        indexDatabase ind = new indexDatabase();
        ind.setConteudo(siteContent);
        ind.Index();
    }
}