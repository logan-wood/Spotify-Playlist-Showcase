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