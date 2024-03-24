export type User = {
    username: string,
}

export type Presentation = {
    id: number;
    playlist_id: string;
    track_queue: {
        track_id: string,
        from: number,
        to: number
    }[];
}