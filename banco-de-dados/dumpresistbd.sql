-- MariaDB dump 10.19  Distrib 10.11.6-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: resistBD
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `acessos`
--

DROP TABLE IF EXISTS `acessos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `acessos` (
  `id_acesso` int(11) NOT NULL AUTO_INCREMENT,
  `data_hora` datetime DEFAULT NULL,
  `ip_maquina` varchar(50) DEFAULT NULL,
  `urlWeb` longtext DEFAULT NULL,
  `id_index` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_acesso`),
  KEY `id_index` (`id_index`),
  CONSTRAINT `acessos_ibfk_1` FOREIGN KEY (`id_index`) REFERENCES `indexacoes` (`id_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acessos`
--

LOCK TABLES `acessos` WRITE;
/*!40000 ALTER TABLE `acessos` DISABLE KEYS */;
/*!40000 ALTER TABLE `acessos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funcXinstituicoes`
--

DROP TABLE IF EXISTS `funcXinstituicoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `funcXinstituicoes` (
  `idFuncXinstituicao` int(11) NOT NULL AUTO_INCREMENT,
  `idInstituicao` int(11) DEFAULT NULL,
  `idFuncionario` int(11) DEFAULT NULL,
  PRIMARY KEY (`idFuncXinstituicao`),
  KEY `idInstituicao` (`idInstituicao`),
  KEY `idFuncionario` (`idFuncionario`),
  CONSTRAINT `funcXinstituicoes_ibfk_1` FOREIGN KEY (`idInstituicao`) REFERENCES `instituicoes` (`idInstituicao`),
  CONSTRAINT `funcXinstituicoes_ibfk_2` FOREIGN KEY (`idFuncionario`) REFERENCES `funcionarios` (`idFuncionario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcXinstituicoes`
--

LOCK TABLES `funcXinstituicoes` WRITE;
/*!40000 ALTER TABLE `funcXinstituicoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `funcXinstituicoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funcionarios`
--

DROP TABLE IF EXISTS `funcionarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `funcionarios` (
  `idFuncionario` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(200) DEFAULT NULL,
  `cpf` varchar(20) DEFAULT NULL,
  `rua` varchar(120) DEFAULT NULL,
  `bairro` varchar(85) DEFAULT NULL,
  `cidade` varchar(50) DEFAULT NULL,
  `estado` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`idFuncionario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionarios`
--

LOCK TABLES `funcionarios` WRITE;
/*!40000 ALTER TABLE `funcionarios` DISABLE KEYS */;
INSERT INTO `funcionarios` VALUES
(1,'Daniel','123.456.789-01','rua 1','vila 2','cidade 3','SP');
/*!40000 ALTER TABLE `funcionarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funcionariosXemails`
--

DROP TABLE IF EXISTS `funcionariosXemails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `funcionariosXemails` (
  `idFuncXemail` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(150) DEFAULT NULL,
  `senha` varchar(250) DEFAULT NULL,
  `idFuncionario` int(11) DEFAULT NULL,
  PRIMARY KEY (`idFuncXemail`),
  KEY `idFuncionario` (`idFuncionario`),
  CONSTRAINT `funcionariosXemails_ibfk_1` FOREIGN KEY (`idFuncionario`) REFERENCES `funcionarios` (`idFuncionario`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionariosXemails`
--

LOCK TABLES `funcionariosXemails` WRITE;
/*!40000 ALTER TABLE `funcionariosXemails` DISABLE KEYS */;
INSERT INTO `funcionariosXemails` VALUES
(1,'email@email.com','$2y$10$57FSa/vmYKRuFY5Pc7fjuecWAGrGEeCZaJpzaJVI.l8O9gmP.gH3S',1);
/*!40000 ALTER TABLE `funcionariosXemails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `funcionariosXtelefones`
--

DROP TABLE IF EXISTS `funcionariosXtelefones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `funcionariosXtelefones` (
  `idFuncXtelefone` int(11) NOT NULL AUTO_INCREMENT,
  `telefone` varchar(25) DEFAULT NULL,
  `idFuncionario` int(11) DEFAULT NULL,
  PRIMARY KEY (`idFuncXtelefone`),
  KEY `idFuncionario` (`idFuncionario`),
  CONSTRAINT `funcionariosXtelefones_ibfk_1` FOREIGN KEY (`idFuncionario`) REFERENCES `funcionarios` (`idFuncionario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `funcionariosXtelefones`
--

LOCK TABLES `funcionariosXtelefones` WRITE;
/*!40000 ALTER TABLE `funcionariosXtelefones` DISABLE KEYS */;
/*!40000 ALTER TABLE `funcionariosXtelefones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `indexXtermos`
--

DROP TABLE IF EXISTS `indexXtermos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `indexXtermos` (
  `id_indexXtermo` int(11) NOT NULL AUTO_INCREMENT,
  `id_index` int(11) DEFAULT NULL,
  `id_termo` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_indexXtermo`),
  KEY `id_index` (`id_index`),
  KEY `id_termo` (`id_termo`),
  CONSTRAINT `indexXtermos_ibfk_1` FOREIGN KEY (`id_index`) REFERENCES `indexacoes` (`id_index`),
  CONSTRAINT `indexXtermos_ibfk_2` FOREIGN KEY (`id_termo`) REFERENCES `termos` (`id_termo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `indexXtermos`
--

LOCK TABLES `indexXtermos` WRITE;
/*!40000 ALTER TABLE `indexXtermos` DISABLE KEYS */;
/*!40000 ALTER TABLE `indexXtermos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `indexacoes`
--

DROP TABLE IF EXISTS `indexacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `indexacoes` (
  `id_index` int(11) NOT NULL AUTO_INCREMENT,
  `pathLocal` longtext DEFAULT NULL,
  `flag` tinyint(1) DEFAULT 1,
  `urlWeb` longtext DEFAULT NULL,
  PRIMARY KEY (`id_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `indexacoes`
--

LOCK TABLES `indexacoes` WRITE;
/*!40000 ALTER TABLE `indexacoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `indexacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instXemails`
--

DROP TABLE IF EXISTS `instXemails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `instXemails` (
  `idInstXemail` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(150) DEFAULT NULL,
  `idInstituicao` int(11) DEFAULT NULL,
  PRIMARY KEY (`idInstXemail`),
  KEY `idInstituicao` (`idInstituicao`),
  CONSTRAINT `instXemails_ibfk_1` FOREIGN KEY (`idInstituicao`) REFERENCES `instituicoes` (`idInstituicao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instXemails`
--

LOCK TABLES `instXemails` WRITE;
/*!40000 ALTER TABLE `instXemails` DISABLE KEYS */;
/*!40000 ALTER TABLE `instXemails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instXtelefones`
--

DROP TABLE IF EXISTS `instXtelefones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `instXtelefones` (
  `idInstXtelefone` int(11) NOT NULL AUTO_INCREMENT,
  `telefone` varchar(25) DEFAULT NULL,
  `idInstituicao` int(11) DEFAULT NULL,
  PRIMARY KEY (`idInstXtelefone`),
  KEY `idInstituicao` (`idInstituicao`),
  CONSTRAINT `instXtelefones_ibfk_1` FOREIGN KEY (`idInstituicao`) REFERENCES `instituicoes` (`idInstituicao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instXtelefones`
--

LOCK TABLES `instXtelefones` WRITE;
/*!40000 ALTER TABLE `instXtelefones` DISABLE KEYS */;
/*!40000 ALTER TABLE `instXtelefones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instituicoes`
--

DROP TABLE IF EXISTS `instituicoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `instituicoes` (
  `idInstituicao` int(11) NOT NULL AUTO_INCREMENT,
  `razaoSocial` varchar(200) DEFAULT NULL,
  `cnpj` varchar(55) DEFAULT NULL,
  `inscricaoEstadual` varchar(35) DEFAULT NULL,
  `logradouro` varchar(220) DEFAULT NULL,
  `numero` int(11) DEFAULT NULL,
  `bairro` varchar(85) DEFAULT NULL,
  `cidade` varchar(50) DEFAULT NULL,
  `estado` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`idInstituicao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instituicoes`
--

LOCK TABLES `instituicoes` WRITE;
/*!40000 ALTER TABLE `instituicoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `instituicoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfis`
--

DROP TABLE IF EXISTS `perfis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `perfis` (
  `idTipo` int(11) NOT NULL AUTO_INCREMENT,
  `nomeTipo` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`idTipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfis`
--

LOCK TABLES `perfis` WRITE;
/*!40000 ALTER TABLE `perfis` DISABLE KEYS */;
/*!40000 ALTER TABLE `perfis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfisXpermissoes`
--

DROP TABLE IF EXISTS `perfisXpermissoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `perfisXpermissoes` (
  `idPerfilPermissao` int(11) NOT NULL AUTO_INCREMENT,
  `idTipo` int(11) DEFAULT NULL,
  `idPermissao` int(11) DEFAULT NULL,
  PRIMARY KEY (`idPerfilPermissao`),
  KEY `idTipo` (`idTipo`),
  KEY `idPermissao` (`idPermissao`),
  CONSTRAINT `perfisXpermissoes_ibfk_1` FOREIGN KEY (`idTipo`) REFERENCES `perfis` (`idTipo`),
  CONSTRAINT `perfisXpermissoes_ibfk_2` FOREIGN KEY (`idPermissao`) REFERENCES `permissoes` (`idPermissao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfisXpermissoes`
--

LOCK TABLES `perfisXpermissoes` WRITE;
/*!40000 ALTER TABLE `perfisXpermissoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `perfisXpermissoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissoes`
--

DROP TABLE IF EXISTS `permissoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissoes` (
  `idPermissao` int(11) NOT NULL AUTO_INCREMENT,
  `nomePermissao` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`idPermissao`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissoes`
--

LOCK TABLES `permissoes` WRITE;
/*!40000 ALTER TABLE `permissoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `termos`
--

DROP TABLE IF EXISTS `termos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `termos` (
  `id_termo` int(11) NOT NULL AUTO_INCREMENT,
  `termo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_termo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `termos`
--

LOCK TABLES `termos` WRITE;
/*!40000 ALTER TABLE `termos` DISABLE KEYS */;
/*!40000 ALTER TABLE `termos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-28 13:46:59
