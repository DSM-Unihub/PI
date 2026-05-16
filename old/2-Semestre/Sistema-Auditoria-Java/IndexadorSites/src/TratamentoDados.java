
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.net.URL;
import java.sql.Date;
import java.util.Locale;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashSet;
import java.util.Set;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author bruno
 */
public class TratamentoDados {
    
    private int id_acesso;
    private String data_hora;
    private String ip_maquina;
    private String url;
    private int idCadastro_fk;
    private int id_index_fk;
    private String data;
    private String hora;
    public TratamentoDados() {
    }

    public TratamentoDados(int id_acesso, String data_hora, String ip_maquina, String url, int idCadastro_fk, int id_index_fk, String data, String hora) {
        this.id_acesso = id_acesso;
        this.data_hora = data_hora;
        this.ip_maquina = ip_maquina;
        this.url = url;
        this.idCadastro_fk = idCadastro_fk;
        this.id_index_fk = id_index_fk;
        this.data = data;
        this.hora = hora;
    }

    

    public int getId_acesso() {
        return id_acesso;
    }

    public void setId_acesso(int id_acesso) {
        this.id_acesso = id_acesso;
    }

    public String getData_hora() {
        return data_hora;
    }

    public void setData_hora(String data_hora) {
        this.data_hora = data_hora;
    }

    public String getIp_maquina() {
        return ip_maquina;
    }

    public void setIp_maquina(String ip_maquina) {
        this.ip_maquina = ip_maquina;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public int getIdCadastro_fk() {
        return idCadastro_fk;
    }

    public void setIdCadastro_fk(int idCadastro_fk) {
        this.idCadastro_fk = idCadastro_fk;
    }

    public int getId_index_fk() {
        return id_index_fk;
    }

    public void setId_index_fk(int id_index_fk) {
        this.id_index_fk = id_index_fk;
    }
    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public String getHora() {
        return hora;
    }

    public void setHora(String hora) {
        this.hora = hora;
    }

    String setUrl() {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
    
     public static String showHost(String site){
       /* if (!site.startsWith("http://") && !site.startsWith("https://")) {
        site = "http://" + site;
    }*/
       
       
       
         try{
        URL url = new URL(site);
        String host = url.getHost();
        return host;
        }
         
        catch(Exception e){
        e.printStackTrace();
        
        return "ERRO";
        }
         
        }
     
     public static Set<String> loadSitesFromFile(String positionFilePath) {
        Set<String> sites = new HashSet<>();
        
        
        try (BufferedReader reader = new BufferedReader(new FileReader(positionFilePath))) {
            
            String line;
            while ((line = reader.readLine()) != null) {
                sites.add(line.trim());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return sites;
    }
     
       public static String removePort(String url) {
        // Verifica se a URL termina com ":443"
        if (url.endsWith(":443")) {
            // Remove os últimos 4 caracteres (":443")
            return url.substring(0, url.length() - 4);
        }
        // Retorna a URL sem modificações se não termina com ":443"
        return url;
    }
    
          
       
public static String extractSiteFromLogLine(String logLine) {
    // Dividir a linha do log pelo espaço em branco
    String[] parts = logLine.split("\\s+");
    
    // Procurar pela parte que contém o site, que deve ser a última ou penúltima parte da linha
    for (String part : parts) {
        if (part.contains(".com") || part.contains(".net") || part.contains(".org") || part.contains(".edu") || part.contains(".gov") || part.contains(".io") || part.contains(".co")) {
            return part.replace(":443", ""); // Remover a porta 443, se presente
        }
    }
    return null; // Retornar null se nenhum site for encontrado na linha
}

public static String extractDateTimeFromLogLine(String logLine) {
    
        String[] parts = logLine.split("\\s+");
        if (parts.length >= 4) {
            
            String siteWithPort = parts[0];
            // Remove a porta ":443" se estiver presente
            return removePort(siteWithPort);
        }
        return null; // Retorna null se a linha não tem o formato esperado
    }
public static String extractDateFromLogLine(String logLine) {
    
        String[] parts = logLine.split("\\s+");
        if (parts.length >= 4) {
            
            String siteWithPort = parts[0];
            // Remove a porta ":443" se estiver presente
            return removePort(siteWithPort);
        }
        return null; // Retorna null se a linha não tem o formato esperado
    }
public static String extractTimeFromLogLine(String logLine) {
    
        String[] parts = logLine.split("\\s+");
        if (parts.length >= 4) {
            
            String siteWithPort = parts[1];
            // Remove a porta ":443" se estiver presente
            return removePort(siteWithPort);
        }
        return null; // Retorna null se a linha não tem o formato esperado
    }

 public static String convertToMySQLFormat(String inputDate) {
        // Define o formato do input com locale apropriado
        SimpleDateFormat inputFormat = new SimpleDateFormat("dd/MM/yyyy:HH:mm:ss:SSS", Locale.ENGLISH);
        // Define o formato do output (formato MySQL)
        SimpleDateFormat outputFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        String outputDate = null;
        try {
            // Faz o parse da data de entrada
            java.util.Date date = inputFormat.parse(inputDate);
            // Formata a data no formato de saída
            outputDate = outputFormat.format(date);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return outputDate;
    }

public static String extractIPFromLogLine(String logLine) {
    
        String[] parts = logLine.split("\\s+");
        if (parts.length >= 4) {
            
            String siteWithPort = parts[2];
            return removePort(siteWithPort);
        }
        return null; 
    }

    public static void appendSiteToArmFile(String positionFilePath, String site) {
        
        
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(positionFilePath, true))) {
            writer.write(site);
            writer.newLine(); // Adiciona uma nova linha para separar os sites
        } catch (IOException e) {
            e.printStackTrace();
        }
        
    
        
        
    }
    
    public static String extractHtml(String url) throws IOException {
    // Adiciona o esquema se estiver ausente
    

    Document doc = Jsoup.connect(url).get();
    return doc.outerHtml(); // Retorna o HTML completo da página
}
    
}
