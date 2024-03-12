import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Presentation } from '../../presentation/entities/presentation.entity';


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    spotify_id: string;

    @Column()
    username: string;

    // set to random for security
    @Column()
    spotify_cookie: string;

    @Column()
    access_token: string;
    
    @Column()
    access_token_expires_on: Date

    @Column()
    refresh_token: string;

    @OneToMany(type => Presentation, presentation => presentation.user)
    presentations: Presentation[] ;
}