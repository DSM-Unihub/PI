
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author mandirad
 */
public class indexDatabase {
  private String conteudo;
  private String url;
  private String database;
  private String password;
  
  public indexDatabase(){
      this("","","","");
  }

    public indexDatabase(String conteudo, String url, String database, String password) {
        this.conteudo = conteudo;
        this.url = url;
        this.database = database;
        this.password = password;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    public void conexao(){
        
    }
    public void Index(){
        System.out.println(getConteudo());
    }
}
