import { Module } from "@nestjs/common";
import { SpotifyController } from "./spotify.controller";
import { SpotifyService } from "./spotify.service";
import { ConfigModule } from "@nestjs/config";

@Module({
    controllers: [SpotifyController],
    providers: [SpotifyService],
    exports: [SpotifyService],
    imports: [ConfigModule]
})
export class SpotifyModule {}