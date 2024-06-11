import { Module } from '@nestjs/common';
import { PresentationsService } from './presentations.service';
import { PresentationsController } from './presentations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Presentation } from './entities/presentation.entity';
import { UsersModule } from 'src/users/users.module';
import { SpotifyModule } from 'src/spotify/spotify.module';

@Module({
  imports: [TypeOrmModule.forFeature([Presentation]), UsersModule, SpotifyModule],
  controllers: [PresentationsController],
  providers: [PresentationsService],
})
export class PresentationsModule {}
