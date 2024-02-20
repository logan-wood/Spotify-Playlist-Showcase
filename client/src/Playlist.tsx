import React, { useEffect } from 'react';
import { useParams } from "react-router-dom";

function Playlist() {
    const { playlistId } = useParams();
    
    useEffect(() => {
        console.log(playlistId);
    }, [])

    return (
        <div>Playlist {playlistId}</div>
    )
}

export default Playlist;