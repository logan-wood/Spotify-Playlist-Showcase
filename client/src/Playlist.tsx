import React, { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";
import WebPlayback from './components/player/Player';
import { Playlist as PlaylistType, Track } from './@types/spotify';
import Nav from './components/Navigation';
import './styles/playlist.scss';
import EditPresentation from './components/EditPresentation';

interface PlayerRef {
    playTrack: (track_id: string, position_ms: number) => void
}

function Playlist() {
    const [token, setToken] = useState<string>('');
    const [playlist, setPlaylist] = useState<PlaylistType | null>(null)
    const [editPresentation, setEditPresentation] = useState<boolean>(false);

    const { playlist_id } = useParams();

    const playerRef = useRef<PlayerRef>(null);

    // reference to webPlayback component

    useEffect(() => {
        getAccessToken();
        getPlaylistData();
    }, [])

    const getPlaylistData = async (): Promise<void> => {
        try {
            const response = await fetch(process.env.REACT_APP_SERVER_DOMAIN + '/spotify/playlist?playlist_id=' + playlist_id, { credentials: 'include' });
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
            const response = await fetch(process.env.REACT_APP_SERVER_DOMAIN + '/users/accessToken', { credentials: 'include' });
            const accessToken: string = await response.text();
            
            setToken(accessToken);
        } catch (error) {
            console.log(error);
        }
    }

    const playTrack = async (track_id: string, position_ms: number) => {
        console.log(playerRef.current)
        playerRef.current?.playTrack(track_id, position_ms);
        // got here
    }

    return (
        <>
            <Nav isUserLoggedIn={true} />
            {playlist && (
                <div className='playlist'>
                    <div className='playlist-label'>
                        <h4>{playlist.name}</h4>
                        <img src={playlist.images[0].url} alt='Playlist Image' />
                    </div>
                    <div className='playlist-tracks'>
                    {playlist?.tracks.items.map((track, index) => {
                        return (
                        <div key={index} className='track'>
                            <p onClick={() => { playTrack(track.track.id, 0) }}>▶ {track.track.name}</p>
                        </div>
                        )
                    })}
                    </div>
                    {playlist && <button onClick={() => {setEditPresentation(true)}}>Edit Presentation</button>}
                    {(editPresentation && playlist) && <EditPresentation playlist={playlist} />}
                </div>
            )}

            

            {token && ( <WebPlayback ref={playerRef} token={token} /> )}
        </>
    )
}

export default Playlist;