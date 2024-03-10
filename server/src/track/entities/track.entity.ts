import { Column, PrimaryGeneratedColumn } from "typeorm";

export class Track {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    spotify_track_id: string;

    @Column()
    from: number;

    @Column()
    to: number;
}
