import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Presentation {
    @PrimaryGeneratedColumn()
    id: number;

    // change to foreign key
    @Column()
    user_id: number;
    
    @Column()
    playlist_id: string;
    
    @Column()
    track_queue: Array<String>;
}
