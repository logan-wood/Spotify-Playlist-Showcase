import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { SpotifyController } from './spotify/spotify.controller';
import { SpotifyService } from './spotify/spotify.service';

@Module({
  imports: [AuthModule, ConfigModule.forRoot(), TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'Spotify_Playlist_Showcase_Dev',
    autoLoadEntities: true,
    synchronize: false
  }), UsersModule],
  controllers: [AppController, UsersController, SpotifyController],
  providers: [AppService, UsersService, SpotifyService],
})
export class AppModule {}
