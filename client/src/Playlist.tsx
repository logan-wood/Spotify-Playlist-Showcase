import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import WebPlayback from './components/player/Player';
import { Playlist as PlaylistType, Track } from './@types/spotify';

interface PlayerRef {
    playTrack: (track_id: string, position_ms: number) => void
}

function Playlist() {
    const [token, setToken] = useState<string>('');
    const [playlist, setPlaylist] = useState<PlaylistType | null>(null)

    const { playlistId } = useParams();

    const playerRef = useRef<PlayerRef>(null);

    // reference to webPlayback component

    useEffect(() => {
        getAccessToken();
        getPlaylistData();
    }, [])

    useEffect(() => {
        console.log(playlist?.tracks.items)
    }, [playlist])

    const getPlaylistData = async (): Promise<void> => {
        try {
            const response = await fetch(process.env.REACT_APP_SERVER_DOMAIN + '/spotify/playlist?playlist_id=' + playlistId);
            if (response.ok) {
                const data = await response.json();

                setPlaylist(data);
            }
        } catch(error) {
            console.error(error);
        }
    }

    const getAccessToken = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_SERVER_DOMAIN + '/users/accessToken');
            const accessToken: string = await response.text();
            
            setToken(accessToken);
        } catch (error) {
            console.log(error);
        }
    }

    const playTrack = async (track_id: string, position_ms: number) => {
        playerRef.current?.playTrack(track_id, position_ms);
        // got here
    }

    return (
        <>
            {playlist && (
                <div>{playlist.name}</div>
            )}

            {playlist?.tracks.items.map((track, index) => {

                return (
                <div key={index}>
                    <p onClick={() => { playTrack(track.track.id, 0) }}>{track.track.name}</p>
                </div>
                )
            })}

            {token && ( <WebPlayback ref={playerRef} token={token} /> )}
        </>
    )
}

export default Playlist;