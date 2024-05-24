import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import WebPlayback from './components/player/Player';
import { Playlist as PlaylistType, Track } from './@types/spotify';
import Nav from './components/Navigation';
import './styles/playlist.scss';
import EditPresentation from './components/presentation/EditPresentation';
import PlayPresentation from './components/presentation/PlayPresentation';
import { Presentation } from './@types/user';

function Playlist() {
    const [token, setToken] = useState<string>('');
    const [playlist, setPlaylist] = useState<PlaylistType | null>(null);
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [editPresentation, setEditPresentation] = useState<boolean>(false);

    const { playlist_id } = useParams();

    const navigate = useNavigate()

    useEffect(() => {
        getPlaylistData();
    }, [])

    useEffect(() => {
        getPresentation();
    }, [playlist])

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

    const getPresentation = async () => {
        if (!playlist) {
            console.error('Playlist is null');
            return;
        }

        try {
            const response = await fetch(process.env.REACT_APP_SERVER_DOMAIN + `/presentations/${playlist.id}`, { credentials: 'include' });

            if (response.ok) {
                const data = await response.json();
                
                setPresentation({
                    id: data.id,
                    playlist_id: data.playlist_id,
                    track_queue: data.track_queue
                });
            }
        } catch(error) {
            console.error('An error occured fetching the presentation: ' + error);
        };
    };

    const openPresentation = () => {
        navigate(`/presentation/${presentation?.id}`)
    } 

    return (
        <>
            <Nav isUserLoggedIn={true} />
            {playlist && (
                <div className='playlist'>
                    {playlist && <button onClick={() => {setEditPresentation(true)}}>Edit Presentation</button>}
                    <div className='playlist-label'>
                        <h4>{playlist.name}</h4>
                        <img src={playlist.images[0].url} alt='Playlist Image' />
                    </div>
                    <div className='playlist-tracks'>
                    {playlist?.tracks.items.map((track, index) => {
                        return (
                        <div key={index} className='track'>
                        </div>
                        )
                    })}
                    </div>
                    
                    {(editPresentation && presentation && playlist) && <EditPresentation playlist={playlist} presentation={presentation} close={(): void => { setEditPresentation(false) } } />}
                    {presentation && <button onClick={openPresentation}>Play Showcase</button>}
                </div>
            )}
        </>
    )
}

export default Playlist;