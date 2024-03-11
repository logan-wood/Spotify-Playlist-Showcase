import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/users/user.entity";

@Entity()
export class Presentation {
    @PrimaryGeneratedColumn()
    id: number;

    // change to foreign key
    @ManyToOne(() => User, (user) => user.id)
    user_id: number;
    
    @Column()
    playlist_id: string;
    
    @Column()
    track_queue: Array<Number>;
}
