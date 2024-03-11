import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
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
