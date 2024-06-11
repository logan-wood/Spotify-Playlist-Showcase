import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { SpotifyService } from "src/spotify/spotify.service";

@Module({
    controllers: [UsersController],
    providers: [UsersService, SpotifyService],
    exports: [TypeOrmModule, UsersService],
    imports: [ConfigModule, TypeOrmModule.forFeature([User])]
})
export class UsersModule {}