import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import WebPlayback from './components/WebPlayback';
import { createRoot } from 'react-dom/client';

function Playlist() {
    const [token, setToken] = useState<string>('');
    const { playlistId } = useParams();

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
            { (token != '') && <WebPlayback token={token} />}
        </>
    )
}

export default Playlist;