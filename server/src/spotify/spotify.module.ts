import { Module } from "@nestjs/common";
import { SpotifyController } from "./spotify.controller";
import { SpotifyService } from "./spotify.service";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "src/users/users.module";

@Module({
    controllers: [SpotifyController],
    providers: [SpotifyService],
    exports: [SpotifyService],
    imports: [ConfigModule, UsersModule]
})
export class SpotifyModule {}