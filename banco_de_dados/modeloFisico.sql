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

CREATE TABLE usuario(
	id_user INT AUTO_INCREMENT,
    cpf VARCHAR(11),
    email VARCHAR(40),
    senha VARCHAR(15),
    cidade VARCHAR(20),
    estado VARCHAR(2),
	PRIMARY KEY (id_user)
);



