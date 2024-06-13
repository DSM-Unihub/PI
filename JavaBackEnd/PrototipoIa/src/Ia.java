import ia.Conexao;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.FileReader;
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class Ia {

    private static Conexao conexao = new Conexao();
    private static final String FILE_PATH = "C:\\Users\\bruno\\Desktop\\test\\iatest\\bloqueio.txt"; 
    private static final String ID_FILE_PATH = "C:\\Users\\bruno\\Desktop\\test\\iatest\\id.txt"; 

    public static void main(String[] args) {
        int lastId = getLastProcessedId();
        
        while (true) {
            try {
                ResultSet rs = conexao.RetornarResultset("SELECT * FROM indexacoes WHERE id_index > " + lastId + " ORDER BY id_index ASC");
                
                while (rs.next()) {
                    String pathLocal = "C:\\Users\\bruno\\Desktop\\test\\sites\\" + rs.getString("pathLocal");
                    String urlWeb = rs.getString("urlWeb");

                    if (containsCake(pathLocal)) {
                        writeToFile(urlWeb);
                    }
                    
                    lastId = rs.getInt("id_index");
                    saveLastProcessedId(lastId);
                }
                
                Thread.sleep(5000); // Espera 5 segundos antes de verificar novamente
            } catch (SQLException | IOException | InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    private static boolean containsCake(String filePath) {
        try {
            String content = new String(Files.readAllBytes(Paths.get(filePath)));
            return content.contains("cake");
        } catch (IOException e) {
            System.err.println("Erro ao ler o arquivo HTML: " + e.getMessage());
            return false;
        }
    }

    private static void writeToFile(String urlWeb) throws IOException {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(FILE_PATH, true))) {
            writer.write(urlWeb);
            writer.newLine();
        }
    }

    private static int getLastProcessedId() {
        int lastId = 0; // Valor padrão caso o arquivo não exista ou esteja vazio
        try (BufferedReader reader = new BufferedReader(new FileReader(ID_FILE_PATH))) {
            String line = reader.readLine();
            if (line != null) {
                lastId = Integer.parseInt(line);
            }
        } catch (IOException e) {
            System.err.println("Erro ao ler o arquivo de ID: " + e.getMessage());
        }
        return lastId;
    }

    private static void saveLastProcessedId(int lastId) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(ID_FILE_PATH))) {
            writer.write(Integer.toString(lastId));
        } catch (IOException e) {
            System.err.println("Erro ao salvar o último ID processado: " + e.getMessage());
        }
    }
}
