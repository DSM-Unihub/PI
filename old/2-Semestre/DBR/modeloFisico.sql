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