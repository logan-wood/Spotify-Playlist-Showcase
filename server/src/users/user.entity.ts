import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    spotify_cookie: string;

    @Column()
    access_token: string;

    @Column()
    refresh_token: string;
}