-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: secure_file_sharing_2
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administrations`
--

DROP TABLE IF EXISTS `administrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `administration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted_administration` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrations`
--

LOCK TABLES `administrations` WRITE;
/*!40000 ALTER TABLE `administrations` DISABLE KEYS */;
INSERT INTO `administrations` VALUES (8,'SUPERADMIN',0),(23,'1 ci idare',0);
/*!40000 ALTER TABLE `administrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `age_evaluations`
--

DROP TABLE IF EXISTS `age_evaluations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `age_evaluations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `min_age` int NOT NULL,
  `max_age` int NOT NULL,
  `so_bad_min` int NOT NULL,
  `so_bad_max` int NOT NULL,
  `bad_min` int NOT NULL,
  `bad_max` int NOT NULL,
  `good_min` int NOT NULL,
  `good_max` int NOT NULL,
  `best_min` int NOT NULL,
  `best_max` int NOT NULL,
  `deleted_age_evaluation` int NOT NULL,
  `criterion_id` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `age_evaluations`
--

LOCK TABLES `age_evaluations` WRITE;
/*!40000 ALTER TABLE `age_evaluations` DISABLE KEYS */;
INSERT INTO `age_evaluations` VALUES (30,10,20,11,12,13,17,18,19,20,22,0,45),(31,30,40,0,20,20,30,30,40,40,50,0,47),(32,40,50,0,15,15,25,25,30,35,40,0,47);
/*!40000 ALTER TABLE `age_evaluations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `criterions`
--

DROP TABLE IF EXISTS `criterions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `criterions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `criterion_name` varchar(255) NOT NULL,
  `criterion_description` varchar(255) NOT NULL,
  `reversed` int NOT NULL,
  `unit_id` int NOT NULL,
  `age_effect` int NOT NULL,
  `so_bad_min` int NOT NULL,
  `so_bad_max` int NOT NULL,
  `bad_min` int NOT NULL,
  `bad_max` int NOT NULL,
  `good_min` int NOT NULL,
  `good_max` int NOT NULL,
  `best_min` int NOT NULL,
  `best_max` int NOT NULL,
  `deleted_criterion` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `unit_id` (`unit_id`),
  CONSTRAINT `criterions_ibfk_1` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `criterions`
--

LOCK TABLES `criterions` WRITE;
/*!40000 ALTER TABLE `criterions` DISABLE KEYS */;
INSERT INTO `criterions` VALUES (45,'test1','test1',1,2,1,0,0,0,0,0,0,0,0,1),(46,'25 m Məsafədən Atış','ashf askf bjhas fkhas ',0,2,0,0,20,20,30,30,40,40,50,0),(47,'test 2','asf asf',0,1,1,0,0,0,0,0,0,0,0,0),(48,'dsf','sdg',0,3,0,10,20,30,40,50,60,70,80,0);
/*!40000 ALTER TABLE `criterions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cryptography_methods`
--

DROP TABLE IF EXISTS `cryptography_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cryptography_methods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cryptography_methods`
--

LOCK TABLES `cryptography_methods` WRITE;
/*!40000 ALTER TABLE `cryptography_methods` DISABLE KEYS */;
INSERT INTO `cryptography_methods` VALUES (1,'AES'),(2,'DES'),(3,'RSA'),(4,'ECC');
/*!40000 ALTER TABLE `cryptography_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `department_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `administration_id` int NOT NULL,
  `deleted_department` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `administration_id` (`administration_id`),
  CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`administration_id`) REFERENCES `administrations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (12,'SUPERADMIN',8,0),(47,'1 ci sovbe',23,0);
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `flow`
--

DROP TABLE IF EXISTS `flow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `flow` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `orginal_file_name` varchar(255) NOT NULL,
  `secured_file_name` varchar(255) NOT NULL,
  `from_email` int NOT NULL,
  `to_email` int NOT NULL,
  `cryption` int NOT NULL,
  `date` varchar(255) NOT NULL,
  `time` varchar(255) NOT NULL,
  `private_key_file` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `public_key_file` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `hash` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cryption` (`cryption`),
  KEY `from_email` (`from_email`),
  KEY `to_email` (`to_email`),
  CONSTRAINT `flow_ibfk_1` FOREIGN KEY (`cryption`) REFERENCES `cryptography_methods` (`id`),
  CONSTRAINT `flow_ibfk_2` FOREIGN KEY (`from_email`) REFERENCES `users` (`id`),
  CONSTRAINT `flow_ibfk_3` FOREIGN KEY (`to_email`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `flow`
--

LOCK TABLES `flow` WRITE;
/*!40000 ALTER TABLE `flow` DISABLE KEYS */;
/*!40000 ALTER TABLE `flow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `permission_name_az` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (10,'view_users','İstifadəçiləri Görə Bilər'),(11,'add_user','İstifadəçi Əlavə Edə Bilər'),(12,'edit_user','İstifadəçi Redaktə Edə Bilər'),(13,'delete_user','İstifadəçi Silə Bilər'),(14,'view_administrations','İdarələri Görə Bilər'),(15,'add_administration','İdarə Əlavə Edə Bilər'),(16,'edit_administration','İdarə Redaktə Edə Bilər'),(17,'delete_administration','İdarə Silə  Bilər'),(18,'view_departments','Şöbələri Görə Bilər'),(19,'add_department','Şöbə Əlavə Edə Bilər'),(20,'edit_department','Şöbə Redaktə Edə Bilər'),(21,'delete_department','Şöbə Silə Bilər'),(22,'view_roles','Rolları Görə Bilər'),(23,'add_role','Rol Əlavə Edə Bilər'),(24,'edit_role','Rol Redaktə Edə Bilər'),(25,'delete_role','Rol Silə Bilər'),(26,'view_permissions','İcazələri Görə Bilər'),(27,'add_permission','İcazə Əlavə Edə Bilər'),(28,'edit_permission','İcazə Redaktə Edə Bilər'),(29,'delete_permission','İcazə Silə Bilər'),(30,'active_user','İstifadəçidir'),(32,'login_users','İstifadəçilərə Daxil Ola Bilər');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `result`
--

DROP TABLE IF EXISTS `result`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `result` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `result` int NOT NULL,
  `result_owner_id` int NOT NULL,
  `criterion_id` int NOT NULL,
  `result_date` varchar(255) NOT NULL,
  `results_id` int NOT NULL,
  `deleted_result` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `result`
--

LOCK TABLES `result` WRITE;
/*!40000 ALTER TABLE `result` DISABLE KEYS */;
INSERT INTO `result` VALUES (5,31,45,11,46,'2025-06-09',16,0),(6,31,42,11,46,'2025-06-09',16,0);
/*!40000 ALTER TABLE `result` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `results`
--

DROP TABLE IF EXISTS `results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `results_owner_id` int NOT NULL,
  `results_date` varchar(255) NOT NULL,
  `deleted_results` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `results`
--

LOCK TABLES `results` WRITE;
/*!40000 ALTER TABLE `results` DISABLE KEYS */;
INSERT INTO `results` VALUES (16,11,'2025-06-09',0);
/*!40000 ALTER TABLE `results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (5,10),(6,10),(7,10),(5,11),(6,11),(7,11),(5,12),(6,12),(7,12),(5,13),(5,14),(5,15),(5,16),(5,17),(5,18),(6,18),(5,19),(6,19),(5,20),(6,20),(5,21),(5,22),(5,23),(5,24),(5,25),(5,26),(5,27),(5,28),(5,29),(5,30),(6,30),(7,30),(8,30),(5,32),(6,32),(7,32);
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (6,'admin'),(7,'subadmin'),(5,'superadmin'),(8,'user');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `units`
--

DROP TABLE IF EXISTS `units`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `units` (
  `id` int NOT NULL AUTO_INCREMENT,
  `unit_name` varchar(255) NOT NULL,
  `unit_description` varchar(255) NOT NULL,
  `deleted_unit` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `units`
--

LOCK TABLES `units` WRITE;
/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` VALUES (1,'san','Saniyə',0),(2,'dəfə','Dəfə',0),(3,'checkbox','yerine yetrilen emelyetlar',0);
/*!40000 ALTER TABLE `units` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `fathername` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `administration_id` int NOT NULL,
  `department_id` int NOT NULL,
  `birth_day` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `deleted_user` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `role_id` (`role_id`),
  KEY `administration_id` (`administration_id`),
  KEY `department_id` (`department_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`administration_id`) REFERENCES `administrations` (`id`),
  CONSTRAINT `users_ibfk_3` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (11,'superadmin@gmail.com','$2b$10$dFp779xS2kwzrLxstshfT.iGOh2zCaV8eLLe8qfq/ShxSJZi73bYO',5,'Super','Admin','System','994000000000',8,12,'1976-06-19',0),(31,'fuadeliyev@gmail.com','$2b$10$.h3g75ynD9Lo0Zeyo1n44e7LkDnyyhquZIDDjE5QZKaiE3ICwwYQe',6,'Fuad','Əliyev','Raul','994709161820',23,47,'2025-06-26',0),(32,'sdgkjh@wjldg.sdg','$2b$10$s2JINzmhoQzB4mgFNPYgguLXJESddSo6G8LWlLArRypzLcq7iqoGW',7,'askfj ','fksdha f','fad skf ','994709161820',23,47,'2025-06-09',0),(33,'asjdgh@sdigusbdg.sdg','$2b$10$TLd296d3qussw45WeQRRgeg0pIMnyH2AiKR6/sBBRJcBL7hQq13fq',8,'test','etstasf','askfjhl','29387523',23,47,'2025-06-09',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-22 17:50:00
