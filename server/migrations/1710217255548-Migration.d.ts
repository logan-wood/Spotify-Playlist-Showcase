import { MigrationInterface, QueryRunner } from "typeorm";
export declare class Migration1710217255548 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
