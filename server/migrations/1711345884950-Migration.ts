import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1711345884950 implements MigrationInterface {
    name = 'Migration1711345884950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`track\` (\`id\` int NOT NULL AUTO_INCREMENT, \`spotify_track_id\` varchar(255) NOT NULL, \`from\` int NOT NULL, \`to\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`presentation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`playlist_id\` varchar(255) NOT NULL, \`track_queue\` varchar(255) NOT NULL DEFAULT '[]', \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`spotify_id\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`spotify_cookie\` varchar(255) NOT NULL, \`access_token\` varchar(255) NOT NULL, \`access_token_expires_on\` datetime NOT NULL, \`refresh_token\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`presentation\` ADD CONSTRAINT \`FK_b9bb61099f93dd14c23ba2112d8\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`presentation\` DROP FOREIGN KEY \`FK_b9bb61099f93dd14c23ba2112d8\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`presentation\``);
        await queryRunner.query(`DROP TABLE \`track\``);
    }

}
