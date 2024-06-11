import { DataSource, DataSourceOptions } from "typeorm";
import { join, resolve } from "path";
import { config } from "dotenv";
config();

export const dataSourceConfig: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['../**/entities/*.entity.{js, ts}'],
    migrationsTableName: 'migrations',
    migrations: ['../migrations/*.ts'],
    synchronize: false,
    logging: false
}

const dataSource = new DataSource(dataSourceConfig);
export default dataSource;