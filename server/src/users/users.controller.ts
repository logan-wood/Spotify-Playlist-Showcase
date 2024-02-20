import { Controller, Get, Req } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getAll(): Promise<User[]> {
        return await this.usersService.findAll(); 
    }

    @Get('fromCookie')
    async getFromCookie(@Req() request: Request): Promise<User> {
        return await this.usersService.findOneBySpotifyCookie(request);
    }

    @Get('accessToken')
    async getAccessToken(@Req() request: Request): Promise<string> {
        return (await this.usersService.findOneBySpotifyCookie(request)).access_token;
    }

}
