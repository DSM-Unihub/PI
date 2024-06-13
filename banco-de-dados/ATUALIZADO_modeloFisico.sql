CREATE DATABASE if not exists resistBD;
USE resistBD;

CREATE TABLE if not exists indexacoes(
	id_index INT AUTO_INCREMENT,
    pathLocal LONGTEXT,
    flag BOOLEAN DEFAULT TRUE,
    urlWeb LONGTEXT,
    PRIMARY KEY(id_index)
);

CREATE TABLE if not exists termos(
	id_termo INT AUTO_INCREMENT,
    termo VARCHAR(50),
    PRIMARY KEY (id_termo)
);

CREATE TABLE if not exists indexXtermos(
	id_indexXtermo INT AUTO_INCREMENT,
    id_index INT,
    id_termo INT,
    PRIMARY KEY (id_indexXtermo),
    FOREIGN KEY (id_index) REFERENCES indexacoes(id_index),
    FOREIGN KEY (id_termo) REFERENCES termos(id_termo)
);

#---------------------------------------------------------------------
#Parte do Usuário

CREATE TABLE if not exists grupoPermissoes(
	idGrupo INT AUTO_INCREMENT,
    nomeGrupo VARCHAR(80),
	PRIMARY KEY (idGrupo)
);

CREATE TABLE if not exists permissoes(
	idPermissao INT AUTO_INCREMENT,
    nomePermissao VARCHAR(50),
	PRIMARY KEY (idPermissao)
);

CREATE TABLE if not exists  grupoPerXpermissoes(
	idGrupoPerXpermissao INT AUTO_INCREMENT,
    idGrupo INT,
    idPermissao INT,
    PRIMARY KEY (idGrupoPerXpermissao),
    FOREIGN KEY (idGrupo) REFERENCES grupoPermissoes (idGrupo),
    FOREIGN KEY (idPermissao) REFERENCES permissoes (idPermissao)    
);

CREATE TABLE if not exists funcionarios(
	idFuncionario INT AUTO_INCREMENT,
	foto LONGTEXT,
    nome VARCHAR(200),
    cpf VARCHAR(20),
    email VARCHAR (150),
    senha VARCHAR (250),
    rua VARCHAR(120),
    bairro VARCHAR(85),
    cidade VARCHAR(50),
    estado VARCHAR(2),
    idGrupo INT,
    PRIMARY KEY (idFuncionario),
    FOREIGN KEY (idGrupo) REFERENCES grupoPermissoes (idGrupo)
);


CREATE TABLE if not exists funcionariosXtelefones(
	idFuncXtelefone INT AUTO_INCREMENT,
    telefone VARCHAR (25),
    idFuncionario INT,
    PRIMARY KEY(idFuncXtelefone),
    FOREIGN KEY (idFuncionario) REFERENCES funcionarios (idFuncionario)
);

CREATE TABLE if not exists instituicoes(
	idInstituicao INT AUTO_INCREMENT,
    razaoSocial VARCHAR(200),
    cnpj VARCHAR(55),
    inscricaoEstadual VARCHAR(35),
    logradouro VARCHAR(220),
    numero INT,
    bairro VARCHAR(85),
    cidade VARCHAR(50),
    estado VARCHAR(2),
    PRIMARY KEY (idInstituicao)
);

CREATE TABLE if not exists acessos(
	id_acesso INT AUTO_INCREMENT,
    data_hora DATETIME,
    ip_maquina VARCHAR(50),
    urlWeb LONGTEXT,
    id_index INT,
    idInstituicao INT,
    PRIMARY KEY (id_acesso),
    FOREIGN KEY(id_index) REFERENCES indexacoes(id_index),
    FOREIGN KEY (idInstituicao) REFERENCES instituicoes(idInstituicao)
);



CREATE TABLE if not exists funcXinstituicoes(
	idFuncXinstituicao INT AUTO_INCREMENT,
    idInstituicao INT,
    idFuncionario INT,
    PRIMARY KEY (idFuncXinstituicao),
    FOREIGN KEY (idInstituicao) REFERENCES instituicoes(idInstituicao),
    FOREIGN KEY (idFuncionario) REFERENCES funcionarios(idFuncionario)
);

CREATE TABLE if not exists instXtelefones(
	idInstXtelefone INT AUTO_INCREMENT,
    telefone VARCHAR (25),
    idInstituicao INT,
    PRIMARY KEY(idInstXtelefone),
    FOREIGN KEY (idInstituicao) REFERENCES instituicoes (idInstituicao)
);

CREATE TABLE if not exists instXemails(
	idInstXemail INT AUTO_INCREMENT,
    email VARCHAR (150), 
    idInstituicao INT,
    PRIMARY KEY(idInstXemail),
    FOREIGN KEY (idInstituicao) REFERENCES instituicoes (idInstituicao)
);

INSERT INTO 
    permissoes (nomePermissao) 
VALUES
    ('Leitura'),
    ('Atualização'),
    ('Gerar Relatórios'),
    ('Exclusão de Usuários'),
    ('Inserção de Usuários'),
    ('Exclusão de Dados'),
    ('Configurar Permissões'),
    ('Gerar Exceções'),
    ('Visualização de Logs'),
    ('Exportação de Dados'),
    ('Importação de Dados');

INSERT INTO 
    grupoPermissoes(nomeGrupo) 
VALUES 
    ('Super Administrador'),
    ('Analista de Dados Limitado'),
    ('Gerente de Dados'),
    ('Consultor de Dados');

-- Super Administrador
INSERT INTO grupoPerXpermissoes (idGrupo, idPermissao) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(1, 11);
select * from grupoPermissoes;

-- Analista de Dados Limitado
INSERT INTO grupoPerXpermissoes (idGrupo, idPermissao) VALUES
(2, 1),
(2, 3),
(2, 8);

-- Gerente de Dados
INSERT INTO grupoPerXpermissoes (idGrupo, idPermissao) VALUES
(3, 1),
(3, 2),
(3, 3),
(3, 9),
(3, 10),
(3, 11);

-- Consultor de Dados
INSERT INTO grupoPerXpermissoes (idGrupo, idPermissao) VALUES
(4, 1);



CREATE VIEW labs AS
    SELECT 
        `subquery`.`laboratorio` AS `laboratorio`,
        COUNT(`subquery`.`id_acesso`) AS `total_acessos`,
        COUNT(`subquery`.`id_acesso`) * 100.0 / (SELECT 
                COUNT(0)
            FROM
                `resistbd`.`acessos`) AS `porcentagem_acessos`
    FROM
        (SELECT 
            CASE
					WHEN INET_ATON(`resistbd`.`acessos`.`ip_maquina`) BETWEEN INET_ATON('192.168.1.1') AND INET_ATON('192.168.1.30') THEN 'Laboratório 1'
                    WHEN INET_ATON(`resistbd`.`acessos`.`ip_maquina`) BETWEEN INET_ATON('192.168.1.31') AND INET_ATON('192.168.1.60') THEN 'Laboratório 2'
                    WHEN INET_ATON(`resistbd`.`acessos`.`ip_maquina`) BETWEEN INET_ATON('192.168.1.61') AND INET_ATON('192.168.1.90') THEN 'Laboratório 3'
                    WHEN INET_ATON(`resistbd`.`acessos`.`ip_maquina`) BETWEEN INET_ATON('192.168.1.91') AND INET_ATON('192.168.1.120') THEN 'Laboratório 4'
                    WHEN INET_ATON(`resistbd`.`acessos`.`ip_maquina`) BETWEEN INET_ATON('192.168.1.121') AND INET_ATON('192.168.1.150') THEN 'Laboratório 5'
                    WHEN INET_ATON(`resistbd`.`acessos`.`ip_maquina`) BETWEEN INET_ATON('192.168.1.151') AND INET_ATON('192.168.1.180') THEN 'Laboratório 6'
                    WHEN INET_ATON(`resistbd`.`acessos`.`ip_maquina`) BETWEEN INET_ATON('192.168.1.181') AND INET_ATON('192.168.1.210') THEN 'Laboratório Professores'
                    WHEN INET_ATON(`resistbd`.`acessos`.`ip_maquina`) BETWEEN INET_ATON('192.168.1.211') AND INET_ATON('192.168.1.240') THEN 'Laboratório Movel'
                    ELSE 'Outro Laboratório'
                END AS laboratorio,
                `resistbd`.`acessos`.`id_acesso` AS id_acesso
        FROM
        `resistbd`.`acessos`) subquery
    GROUP BY subquery.laboratorio;
    
    INSERT INTO indexacoes (pathLocal, flag, urlWeb) VALUES
('/local/path/example1', FALSE, 'http://example.com/blocked1'),
('/local/path/example2', TRUE, 'http://example.com/allowed1'),
('/local/path/example3', FALSE, 'http://example.com/blocked2'),
('/local/path/example4', TRUE, 'http://example.com/allowed2'),
('/local/path/example5', FALSE, 'http://example.com/blocked3');

INSERT INTO instituicoes (razaoSocial, cnpj, inscricaoEstadual, logradouro, numero, bairro, cidade, estado) VALUES
('Instituição Alpha', '12.345.678/0001-90', '123456789', 'Rua Exemplo 1', 100, 'Bairro A', 'Cidade X', 'SP'),
('Instituição Beta', '98.765.432/0001-10', '987654321', 'Avenida Exemplo 2', 200, 'Bairro B', 'Cidade Y', 'RJ'),
('Instituição Gama', '11.223.344/0001-55', '1122334455', 'Travessa Exemplo 3', 300, 'Bairro C', 'Cidade Z', 'MG'),
('Instituição Delta', '22.334.455/0001-66', '2233445566', 'Praça Exemplo 4', 400, 'Bairro D', 'Cidade W', 'RS'),
('Instituição Épsilon', '33.445.566/0001-77', '3344556677', 'Alameda Exemplo 5', 500, 'Bairro E', 'Cidade V', 'BA'),
('Instituição Zeta', '44.556.677/0001-88', '4455667788', 'Estrada Exemplo 6', 600, 'Bairro F', 'Cidade U', 'PR');


    
INSERT INTO acessos (data_hora, ip_maquina, urlWeb, id_index, idInstituicao) VALUES
-- Laboratório 1
('2025-02-16 16:45:11', '192.168.1.1', 'http://example.com/blocked1', 1, 1),
('2025-02-16 16:45:11', '192.168.1.2', 'http://example.com/blocked1', 1, 1),
-- ... Mais registros para Laboratório 1

-- Laboratório 2
('2025-02-16 16:45:11', '192.168.1.31', 'http://example.com/allowed1', 2, 1),
('2025-02-16 16:45:11', '192.168.1.32', 'http://example.com/allowed1', 2, 1),
-- ... Mais registros para Laboratório 2

-- Laboratório 3
('2025-02-16 16:45:11', '192.168.1.61', 'http://example.com/blocked2', 3, 1),
('2025-02-16 16:45:11', '192.168.1.62', 'http://example.com/blocked2', 3, 1),
-- ... Mais registros para Laboratório 3

-- Laboratório 4
('2025-02-16 16:45:11', '192.168.1.91', 'http://example.com/allowed2', 4, 1),
('2025-02-16 16:45:11', '192.168.1.92', 'http://example.com/allowed2', 4, 1),
-- ... Mais registros para Laboratório 4

-- Laboratório 5
('2025-02-16 16:45:11', '192.168.1.121', 'http://example.com/blocked3', 5, 1),
('2025-02-16 16:45:11', '192.168.1.122', 'http://example.com/blocked3', 5, 1),
-- ... Mais registros para Laboratório 5

-- Laboratório 6
('2025-02-16 16:45:11', '192.168.1.151', 'http://example.com/allowed1', 2, 1),
('2025-02-16 16:45:11', '192.168.1.152', 'http://example.com/allowed1', 2, 1),
-- ... Mais registros para Laboratório 6

-- Laboratório Professores
('2025-02-16 16:45:11', '192.168.1.181', 'http://example.com/blocked2', 3, 1),
('2025-02-16 16:45:11', '192.168.1.182', 'http://example.com/blocked2', 3, 1),
-- ... Mais registros para Laboratório Professores

-- Laboratório Móvel
('2025-02-16 16:45:11', '192.168.1.211', 'http://example.com/blocked3', 5, 1),
('2025-02-16 16:45:11', '192.168.1.212', 'http://example.com/blocked3', 5, 1);

-- Verificação do view
SELECT * FROM labs; 

INSERT INTO 
    grupoPermissoes(nomeGrupo) 
VALUES 
	('Gerente de Projetos'),
	('Diretor de Desenvolvimento'),
	('Analista de Back-end'),
	('Diretor Criativo'),
	('Analista de Infraestrutura'),
	('Estagiário');

-- Tela de Gerenciamento de Usuários!!

SELECT
	f.nome, g.nomeGrupo, f.email
FROM funcionarios f
JOIN grupoPermissoes g
	ON f.idGrupo = g.idGrupo;
	
-- Tela de Bloqueio!!
create view bloqueios as
SELECT 
    a.urlWeb AS URL_Bloqueado, 
    a.data_hora AS data_hora
FROM 
    acessos a
JOIN 
    indexacoes i ON a.id_index = i.id_index
WHERE 
    i.flag = FALSE;

-- Tela de Estatísticas (gráfico de visão geral) acessos BLOQUEADOS!
select * from acessoxmes;

drop view acessoxmes;

create view acessoxmes as
SELECT 
    CASE 
        WHEN l.laboratorio = 'Laboratório Movel' THEN 'Disp. Móveis'
        ELSE 'Desktop'
    END AS tipo_dispositivo,
    l.laboratorio AS laboratorio,
    MONTH(a.data_hora) AS mes_acesso,
    SUM(CASE WHEN l.laboratorio = 'Laboratório Movel' THEN 1 ELSE 0 END) AS contagem_disp_movel,
    SUM(CASE WHEN l.laboratorio <> 'Laboratório Movel' THEN 1 ELSE 0 END) AS contagem_desktop
FROM 
    acessos a
JOIN 
    (SELECT 
        ip_maquina,
        CASE
            WHEN INET_ATON(ip_maquina) BETWEEN INET_ATON('192.168.1.1') AND INET_ATON('192.168.1.30') THEN 'Laboratório 1'
            WHEN INET_ATON(ip_maquina) BETWEEN INET_ATON('192.168.1.31') AND INET_ATON('192.168.1.60') THEN 'Laboratório 2'
            WHEN INET_ATON(ip_maquina) BETWEEN INET_ATON('192.168.1.61') AND INET_ATON('192.168.1.90') THEN 'Laboratório 3'
            WHEN INET_ATON(ip_maquina) BETWEEN INET_ATON('192.168.1.91') AND INET_ATON('192.168.1.120') THEN 'Laboratório 4'
            WHEN INET_ATON(ip_maquina) BETWEEN INET_ATON('192.168.1.121') AND INET_ATON('192.168.1.150') THEN 'Laboratório 5'
            WHEN INET_ATON(ip_maquina) BETWEEN INET_ATON('192.168.1.151') AND INET_ATON('192.168.1.180') THEN 'Laboratório 6'
            WHEN INET_ATON(ip_maquina) BETWEEN INET_ATON('192.168.1.181') AND INET_ATON('192.168.1.210') THEN 'Laboratório Professores'
            WHEN INET_ATON(ip_maquina) BETWEEN INET_ATON('192.168.1.211') AND INET_ATON('192.168.1.240') THEN 'Laboratório Movel'
            ELSE 'Outro Laboratório'
        END AS laboratorio
    FROM 
        acessos) AS l ON a.ip_maquina = l.ip_maquina
JOIN 
    indexacoes i ON a.urlWeb = i.urlWeb
WHERE 
    l.laboratorio IN ('Laboratório Movel', 'Laboratório 1', 'Laboratório 2', 'Laboratório 3', 'Laboratório 4', 'Laboratório 5', 'Laboratório 6', 'Laboratório Professores')
    AND i.flag = false
GROUP BY 
    MONTH(a.data_hora)
ORDER BY 
    MONTH(a.data_hora);



