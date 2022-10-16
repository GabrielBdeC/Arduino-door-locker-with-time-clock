CREATE DATABASE IF NOT EXISTS db_arduino_locker;
USE db_arduino_locker;

CREATE TABLE IF NOT EXISTS `door_locker_user` (
  `door_locker_user_id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `door_locker_user_uuid` VARCHAR(32) NOT NULL COMMENT 'Use in DTO',
  `name` VARCHAR(84) NOT NULL,
  `institution_code` VARCHAR(8) NOT NULL UNIQUE,
  `rfid` VARCHAR(88) NOT NULL COMMENT 'SHA512',
  `authorization` BOOLEAN NOT NULL DEFAULT true,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `changed_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `created_by` BIGINT NOT NULL,
  `changed_by` BIGINT,
  `deleted_by` BIGINT
);

CREATE TABLE IF NOT EXISTS `application_user` (
  `application_user_id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `application_user_uuid` VARCHAR(32) NOT NULL COMMENT 'Use in DTO',
  `login` VARCHAR(84) NOT NULL UNIQUE,
  `password` VARCHAR(128) NOT NULL COMMENT 'ARGON2',
  `application_user_type` ENUM('LOCKER', 'USER', 'ADMIN') DEFAULT 'USER',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `changed_at` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `created_by` BIGINT NOT NULL,
  `changed_by` BIGINT,
  `deleted_by` BIGINT
);

CREATE TABLE IF NOT EXISTS `health_check` (
  `health_check_id` INT PRIMARY KEY AUTO_INCREMENT
);

ALTER TABLE `door_locker_user` ADD FOREIGN KEY (`created_by`) REFERENCES `application_user` (`application_user_id`);

ALTER TABLE `door_locker_user` ADD FOREIGN KEY (`changed_by`) REFERENCES `application_user` (`application_user_id`);

ALTER TABLE `door_locker_user` ADD FOREIGN KEY (`deleted_by`) REFERENCES `application_user` (`application_user_id`);

ALTER TABLE `application_user` ADD FOREIGN KEY (`created_by`) REFERENCES `application_user` (`application_user_id`);

ALTER TABLE `application_user` ADD FOREIGN KEY (`changed_by`) REFERENCES `application_user` (`application_user_id`);

ALTER TABLE `application_user` ADD FOREIGN KEY (`deleted_by`) REFERENCES `application_user` (`application_user_id`);

INSERT IGNORE INTO `health_check` (`health_check_id`) VALUES (1);