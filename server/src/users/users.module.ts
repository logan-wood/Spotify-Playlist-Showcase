import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { UsersRepository } from "./users.repository";

@Module({
    controllers: [UsersController],
    providers: [UsersService],
    exports: [TypeOrmModule, UsersService],
    imports: [ConfigModule, TypeOrmModule.forFeature([User])]
})
export class UsersModule {}