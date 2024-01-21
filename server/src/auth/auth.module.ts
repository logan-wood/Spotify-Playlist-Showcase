import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { SpotifyModule } from 'src/spotify/spotify.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [ConfigModule, UsersModule, SpotifyModule]
})
export class AuthModule {}
