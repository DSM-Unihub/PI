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


SELECT * FROM indexacoes;
SELECT * FROM acessos;

CREATE TABLE termos(
	id_termo INT AUTO_INCREMENT,
    termo VARCHAR(50),
    PRIMARY KEY (id_termo)
);

SELECT * FROM termos;

CREATE TABLE indexXtermo(
	id_indexXtermo INT AUTO_INCREMENT,
    id_index INT,
    id_termo INT,
    PRIMARY KEY (id_indexXtermo),
    FOREIGN KEY (id_index) REFERENCES indexacoes(id_index),
    FOREIGN KEY (id_termo) REFERENCES termos(id_termo)
);

SELECT * FROM indexXtermo;

#---------------------------------------------------------------------
#Parte do Usuário

CREATE TABLE perfil(
	idTipo INT AUTO_INCREMENT,
    nomeTipo VARCHAR(60),
     PRIMARY KEY (idTipo)
);

CREATE TABLE permissoes(
	idPermissoes INT AUTO_INCREMENT,
    nomePermissao VARCHAR(50),
	PRIMARY KEY (idPermissoes)
);

CREATE TABLE perfisXpermissoes(
	idPerfilPermissao INT AUTO_INCREMENT,
    idTipo INT,
    idPermissao INT,
    PRIMARY KEY (idPerfilPermissao),
    FOREIGN KEY (idTipo) REFERENCES perfis(idTipo),
    FOREIGN KEY (idPermissao) REFERENCES permissoes(idPermissao)
);

CREATE TABLE funcionarios(
	idFuncionario INT AUTO_INCREMENT,
    nome VARCHAR(200),
    cpf VARCHAR(20),
    cidade VARCHAR(50),
    estado VARCHAR(2),
    bairro VARCHAR(25),
    rua VARCHAR(80),
    PRIMARY KEY (idFuncionario)
);

CREATE TABLE usuarios(
	idUser INT AUTO_INCREMENT,
    idTipo INT,
    idFuncionario INT,
	PRIMARY KEY(idUser),
    FOREIGN KEY (idTipo) REFERENCES perfis(idTipo),
    FOREIGN KEY (idFuncionario) REFERENCES funcionarios(idFuncionario)
);

CREATE TABLE funcionariosXtelefones(
	idFuncXtelefone INT AUTO_INCREMENT,
    idFuncionario INT,
    telefone VARCHAR(25),
    PRIMARY KEY (idFuncXtelefone),
    FOREIGN KEY (idFuncionario) REFERENCES funcionarios(idFuncionario)
);

CREATE TABLE funcionariosXemails(
	idFuncXemail INT AUTO_INCREMENT,
    idFuncionario INT,
    email VARCHAR(60),
    PRIMARY KEY (idFuncXemail),
    FOREIGN KEY (idFuncionario) REFERENCES funcionarios(idFuncionario)
);

CREATE TABLE cadastro(
	idCadastro INT AUTO_INCREMENT,
    email VARCHAR(40),
    senha VARCHAR(20),
    idUser INT,
    PRIMARY KEY (idCadastro),
    FOREIGN KEY (idUser) REFERENCES usuarios(idUser)
);




