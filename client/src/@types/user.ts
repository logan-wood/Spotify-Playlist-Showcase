export type User = {
    username: string,
}

export type Presentation = {
    id: number;
    playlist_id: string;
    track_queue: TrackQueueItem[];
}

export type TrackQueueItem = {
    track_id: string,
    track_name: string,
    from: number,
    to: number
}