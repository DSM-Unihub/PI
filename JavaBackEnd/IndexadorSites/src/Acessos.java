

import java.sql.SQLException;
 
/*

* To change this license header, choose License Headers in Project Properties.

* To change this template file, choose Tools | Templates

* and open the template in the editor.

*/

/**

*

* @author bruno

*/

public class Acessos {

    Conexao con = new Conexao();

    private int id_acesso;

    private String data_hora;

    private String ip_maquina;

    private String url;

    private int id_index_fk;
 
    public Acessos() {

    }
 
    

    public Acessos(int id_acesso, String data_hora, String ip_maquina, String url, int idCadastro_fk, int id_index_fk) {

        this.id_acesso = id_acesso;

        this.data_hora = data_hora;

        this.ip_maquina = ip_maquina;

        this.url = url;

        this.id_index_fk = id_index_fk;

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
 
 
    public int getId_index_fk() {

        return id_index_fk;

    }
 
    public void setId_index_fk(int id_index_fk) {

        this.id_index_fk = id_index_fk;

    }


     public void cadastrar(){

        if (!getUrl().startsWith("http://") && !getUrl().startsWith("https://")) {

                    setUrl("https://" + getUrl());

                        }

        String sql;

        sql = "insert into acessos(data_hora,ip_maquina,urlWeb,id_index) values('"+getData_hora()+"','"+getIp_maquina()+"','"+getUrl()+"','"+getId_index_fk()+"')";
try{
        con.executeSQL(sql);
}

finally{
        System.out.println(getUrl()+"\n\nAcessos:\nAcesso ao site" +getUrl()+ "registrado com sucesso");
}
        con.desconecta();


    }

    public boolean pesquisar(String site) throws SQLException{

       String sql;

       sql = "SELECT siteSave FROM html WHERE siteSave = '"+site+".txt';";

        boolean res = con.RetornarVouF(sql);

        if (res == false) {

                    System.out.println("A consulta não retornou resultados.");

                    con.desconecta();

                    return false;


                } else{            

            con.desconecta();

            return true;

        }

    }

}
