import { MigrationInterface, QueryRunner } from "typeorm";
export declare class Migration1710736277544 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
