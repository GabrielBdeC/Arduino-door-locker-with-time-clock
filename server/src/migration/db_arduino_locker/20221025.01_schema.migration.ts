import { MigrationInterface, QueryRunner } from 'typeorm';

export class addingArticleMigration1558196824347 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE health_check (
        health_check_id INT PRIMARY KEY AUTO_INCREMENT
      );`,
    );
    await queryRunner.query(
      `INSERT INTO health_check (health_check_id) VALUES (1);`,
    );
    await queryRunner.query(
      `CREATE TABLE application_user (
        application_user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
        application_user_uuid VARCHAR(32) NOT NULL COMMENT 'Use in DTO',
        login VARCHAR(84) NOT NULL UNIQUE,
        password VARCHAR(128) NOT NULL COMMENT 'ARGON2',
        application_user_type ENUM('LOCKER', 'USER', 'ADMIN') DEFAULT 'USER',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        changed_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL DEFAULT NULL,
        created_by BIGINT NOT NULL,
        changed_by BIGINT,
        deleted_by BIGINT
      );`,
    );
    await queryRunner.query(
      `CREATE TABLE door_locker_user (
        door_locker_user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
        door_locker_user_uuid VARCHAR(32) NOT NULL COMMENT 'Use in DTO',
        name VARCHAR(84) NOT NULL,
        institution_code VARCHAR(8) NOT NULL UNIQUE,
        rfid VARCHAR(88) NOT NULL COMMENT 'SHA512',
        authorization BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        changed_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL DEFAULT NULL,
        created_by BIGINT NOT NULL,
        changed_by BIGINT,
        deleted_by BIGINT
      );`,
    );
    await queryRunner.query(
      `ALTER TABLE door_locker_user ADD FOREIGN KEY (created_by) REFERENCES application_user (application_user_id);`,
    );
    await queryRunner.query(
      `ALTER TABLE door_locker_user ADD FOREIGN KEY (changed_by) REFERENCES application_user (application_user_id);`,
    );
    await queryRunner.query(
      `ALTER TABLE door_locker_user ADD FOREIGN KEY (deleted_by) REFERENCES application_user (application_user_id);`,
    );
    await queryRunner.query(
      `ALTER TABLE application_user ADD FOREIGN KEY (created_by) REFERENCES application_user (application_user_id);`,
    );
    await queryRunner.query(
      `ALTER TABLE application_user ADD FOREIGN KEY (changed_by) REFERENCES application_user (application_user_id);`,
    );
    await queryRunner.query(
      `ALTER TABLE application_user ADD FOREIGN KEY (deleted_by) REFERENCES application_user (application_user_id);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE health_check`);
    await queryRunner.query(`DROP TABLE application_user`);
    await queryRunner.query(`DROP TABLE door_locker_user`);
  }
}
