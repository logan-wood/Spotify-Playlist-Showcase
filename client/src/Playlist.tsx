import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import WebPlayback from './components/player/Player';

function Playlist() {
    const [token, setToken] = useState<string>('');
    const [playerReady, setPlayerReady] = useState<boolean>(false);
    const { playlistId } = useParams();

    // reference to webPlayback component

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

    return (
        <>
            <div>Playlist {playlistId}</div>
            {token && ( <WebPlayback token={token} /> )}
        </>
    )
}

export default Playlist;