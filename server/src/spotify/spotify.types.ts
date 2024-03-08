export type SpotifyProfile = {
    display_name: string,
    id: string,
    images: Array<{
        url: string,
        height: number | null,
        width: number | null
    }>
}

export type Playlist = {
    name: string,
    description: string,
    external_urls: {
        spotify: string
    },
    id: string,
    images: Array<{
        url: string,
        height: number | null,
        width: number | null
    }>,
    tracks: {
        href: string,
        total: number
    }
}

export type Track = {
    id: string,
    name: string,
    artists: Array<{
        id: string,
        name: string,
        uri: string
    }>,
    duration_ms: 0,
    album: {
        id: string,
        name: string
        images: Array<{
            url: string,
            height: number | null,
            width: number | null
        }>,
    }
}