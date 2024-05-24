CREATE DATABASE resistBD;
USE resistBD;

CREATE TABLE indexacoes(
	id_index INT AUTO_INCREMENT,
    url LONGTEXT,
    flag BOOLEAN DEFAULT FALSE,
    indexacoes LONGTEXT,
    PRIMARY KEY(id_index)
);

CREATE TABLE acessos(
	id_acesso INT AUTO_INCREMENT,
    data_hora DATETIME,
    ip_maquina VARCHAR(50),
    url LONGTEXT,
    id_index INT,
    PRIMARY KEY (id_acesso),
    FOREIGN KEY(id_index) REFERENCES indexacoes(id_index)
);

CREATE TABLE termos(
	id_termo INT AUTO_INCREMENT,
    termo VARCHAR(50),
    PRIMARY KEY (id_termo)
);

CREATE TABLE indexXtermos(
	id_indexXtermo INT AUTO_INCREMENT,
    id_index INT,
    id_termo INT,
    PRIMARY KEY (id_indexXtermo),
    FOREIGN KEY (id_index) REFERENCES indexacoes(id_index),
    FOREIGN KEY (id_termo) REFERENCES termos(id_termo)
);

#---------------------------------------------------------------------
#Parte do Usuário

CREATE TABLE perfis(
	idTipo INT AUTO_INCREMENT,
    nomeTipo VARCHAR(60),
	PRIMARY KEY (idTipo)
);

CREATE TABLE permissoes(
	idPermissao INT AUTO_INCREMENT,
    nomePermissao VARCHAR(50),
	PRIMARY KEY (idPermissao)
);

CREATE TABLE perfisXpermissoes(
	idPerfilPermissao INT AUTO_INCREMENT,
    idTipo INT,
    idPermissao INT,
    PRIMARY KEY (idPerfilPermissao),
    FOREIGN KEY (idTipo) REFERENCES perfis (idTipo),
    FOREIGN KEY (idPermissao) REFERENCES permissoes (idPermissao)    
);

CREATE TABLE funcionarios(
	idFuncionario INT AUTO_INCREMENT,
    nome VARCHAR(200),
    cpf VARCHAR(20),
    rua VARCHAR(120),
    bairro VARCHAR(85),
    cidade VARCHAR(50),
    estado VARCHAR(2),
    PRIMARY KEY (idFuncionario)
);


CREATE TABLE funcionariosXtelefones(
	idFuncXtelefone INT AUTO_INCREMENT,
    telefone VARCHAR (25),
    idFuncionario INT,
    PRIMARY KEY(idFuncXtelefone),
    FOREIGN KEY (idFuncionario) REFERENCES funcionarios (idFuncionario)
);

CREATE TABLE funcionariosXemails(
	idFuncXemail INT AUTO_INCREMENT,
    email VARCHAR (150),
    senha VARCHAR (15),
    idFuncionario INT,
    PRIMARY KEY(idFuncXemail),
    FOREIGN KEY (idFuncionario) REFERENCES funcionarios (idFuncionario)
);

CREATE TABLE instituicoes(
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

CREATE TABLE funcXinstituicoes(
	idFuncXinstituicao INT AUTO_INCREMENT,
    idInstituicao INT,
    idFuncionario INT,
    PRIMARY KEY (idFuncXinstituicao),
    FOREIGN KEY (idInstituicao) REFERENCES instituicoes(idInstituicao),
    FOREIGN KEY (idFuncionario) REFERENCES funcionarios(idFuncionario)
);

CREATE TABLE instXtelefones(
	idInstXtelefone INT AUTO_INCREMENT,
    telefone VARCHAR (25),
    idInstituicao INT,
    PRIMARY KEY(idInstXtelefone),
    FOREIGN KEY (idInstituicao) REFERENCES instituicoes (idInstituicao)
);

CREATE TABLE instXemails(
	idInstXemail INT AUTO_INCREMENT,
    email VARCHAR (150), 
    idInstituicao INT,
    PRIMARY KEY(idInstXemail),
    FOREIGN KEY (idInstituicao) REFERENCES instituicoes (idInstituicao)
);








