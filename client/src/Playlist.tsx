import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import WebPlayback from './components/WebPlayback';
import { createRoot } from 'react-dom/client';

function Playlist() {
    const [token, setToken] = useState<string>('');
    const [playerReady, setPlayerReady] = useState<boolean>(false);
    const { playlistId } = useParams();

    // reference to webPlayback component
    const webPlaybackRef = React.useRef<any>(null);

    useEffect(() => {
        getAccessToken();
    }, [])

    const getAccessToken = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_SERVER_DOMAIN + '/users/accessToken');
            const accessToken: string = await response.text();
            
            setToken(accessToken);
        } catch (error) {
            console.log(error);
        }
    }

    // called from WebPlayback component once it is ready to start playing tracks.
    const handlePlayerReady = (status: boolean) => {
        setPlayerReady(status);
    };

    // play a track on the WebPlayback component
    const playTrack = (track_id: string, position_ms: number) => {
        if (webPlaybackRef.current) {
            webPlaybackRef.current.playTrack(track_id, position_ms);
        }
    }

    return (
        <>
            <div>Playlist {playlistId}</div>
            {token && ( <WebPlayback token={token} playTrack={webPlaybackRef.current?.playTrack} onPlayerStatusChange={handlePlayerReady} ref={webPlaybackRef} /> )}
            {playerReady && ( <button onClick={() => { playTrack("4e7JOKEUBdrK17PWgBex8Q?si=95b828cd2db04cbd", 0) }}>Play Track</button> )}
        </>
    )
}

export default Playlist;