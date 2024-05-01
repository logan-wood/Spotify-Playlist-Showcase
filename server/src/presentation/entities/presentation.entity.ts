import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/users/entities/user.entity";

@Entity()
export class Presentation {
    @PrimaryGeneratedColumn()
    id: number;

    // change to foreign key
    @ManyToOne(type => User, (user) => user.presentations)
    @JoinColumn()
    user: User;

    @Column()
    playlist_id: string;
     
    @Column({ type: "json", default: null, nullable: false })
    track_queue: TrackQueue[];
}

export type TrackQueue = {
    track_id: string,
    from: number,
    to: number
}