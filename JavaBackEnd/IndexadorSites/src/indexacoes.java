
import java.sql.ResultSet;
import java.sql.SQLException;
import javax.swing.JOptionPane;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 *
 * @author bruno
 */
public class indexacoes {
    
    Conexao con = new Conexao();
    private int id_index;
    private String pathLocal;
    private boolean flag;
    private String indexacao;
    private String urlWeb;

    public indexacoes() {
    }

    
    
    public indexacoes(int id_index, String pathLocal, boolean flag, String indexacao, String urlWeb) {
        this.id_index = id_index;
        this.pathLocal = pathLocal;
        this.flag = flag;
        this.indexacao = indexacao;
        this.urlWeb = urlWeb;
    }
    
    

    public int getId_index() {
        return id_index;
    }

    public void setId_index(int id_index) {
        this.id_index = id_index;
    }

    public String getPathLocal() {
        return pathLocal;
    }

    public void setPathLocal(String pathLocal) {
        this.pathLocal = pathLocal;
    }

    public boolean isFlag() {
        return flag;
    }

    public void setFlag(boolean flag) {
        this.flag = flag;
    }

    public String getIndexacao() {
        return indexacao;
    }

    public void setIndexacao(String indexacao) {
        this.indexacao = indexacao;
    }

    public String getUrlWeb() {
        return urlWeb;
    }

    public void setUrlWeb(String urlWeb) {
        this.urlWeb = urlWeb;
    }
    
    public void IndexarSite(){           
      String sql= "Insert into indexacoes(pathLocal,flag,urlWeb)values "+
                "('"+ getPathLocal()+"','1','"+ getUrlWeb()+"' )";
        con.executeSQL(sql);
    }
    
    public boolean pesquisar(String site) throws SQLException{
        
       String sql;
       sql = "SELECT pathLocal FROM indexacoes WHERE urlWeb = '"+site+"';";
       
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
    
    public String retornarIdIndex(String site) throws SQLException{
        
        
       String sql;
       sql = "SELECT id_index FROM indexacoes WHERE urlWeb = '"+site+"';";
       
        ResultSet res = con.RetornarResultset(sql);
        
        con.RetornarResultset(sql);
        
        String id = res.getString(1);
        
        //System.out.println("-----------retornando id: "+id);
        
        return id;
        

        }
}
    

