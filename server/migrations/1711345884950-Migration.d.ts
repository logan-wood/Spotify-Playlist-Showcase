import { MigrationInterface, QueryRunner } from "typeorm";
export declare class Migration1711345884950 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
