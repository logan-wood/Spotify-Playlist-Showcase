"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration1710217255548 = void 0;
class Migration1710217255548 {
    constructor() {
        this.name = 'Migration1710217255548';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`presentation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`playlist_id\` varchar(255) NOT NULL, \`track_queue\` varchar(255) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`spotify_id\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`spotify_cookie\` varchar(255) NOT NULL, \`access_token\` varchar(255) NOT NULL, \`access_token_expires_on\` datetime NOT NULL, \`refresh_token\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`track\` (\`id\` int NOT NULL AUTO_INCREMENT, \`spotify_track_id\` varchar(255) NOT NULL, \`from\` int NOT NULL, \`to\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`presentation\` ADD CONSTRAINT \`FK_b9bb61099f93dd14c23ba2112d8\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`presentation\` DROP FOREIGN KEY \`FK_b9bb61099f93dd14c23ba2112d8\``);
        await queryRunner.query(`DROP TABLE \`track\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`presentation\``);
    }
}
exports.Migration1710217255548 = Migration1710217255548;
//# sourceMappingURL=1710217255548-Migration.js.map