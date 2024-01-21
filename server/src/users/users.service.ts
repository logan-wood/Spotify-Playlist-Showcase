import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, TableCheck } from "typeorm";
import { User } from "./user.entity";
import { Request } from "express";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>
    ) {}

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: number): Promise<User> {
        return this.usersRepository.findOneBy({ id });
    }
    
    async findOneBySpotifyCookie(request: Request): Promise<User> {
        try {
            const spotify_cookie = request.cookies.identifier;

            

            return await this.usersRepository.findOneBy({ spotify_cookie });
        } catch (error) {
            throw new NotFoundException('Spotify Cookie Not Found');
        }

    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async createOne(user: User) {
        const queryRunner = this.usersRepository.manager.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // see if table exists
            await queryRunner.manager.save(user);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException('There was an error adding the new user to the database', error.message);
        } finally {
            queryRunner.release();
        }
    }
}