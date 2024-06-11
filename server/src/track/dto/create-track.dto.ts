export class CreateTrackDto {
    readonly id: number;
    readonly spotify_track_id: string;
    readonly from: number;
    readonly to: number;
}
