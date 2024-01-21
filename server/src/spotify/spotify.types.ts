export interface SpotifyProfile {
    display_name: string,
    id: string,
    images: Array<{
        url: string,
        height: number,
        width: number
    }>
}