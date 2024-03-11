import { DataSource, DataSourceOptions } from "typeorm";
// import { Presentation } from "../presentation/entities/presentation.entity";
// import { Track } from "../track/entities/track.entity";
// import { User } from "../users/user.entity";

import { config } from "dotenv";
config();

export const dataSourceConfig: DataSourceOptions = {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['dist/src/**/*.entity{.js,.ts}'],
    migrations: ['dist/migrations/**/*{.js,.ts}'],
    synchronize: false,
}

const dataSource = new DataSource(dataSourceConfig);
export default dataSource;