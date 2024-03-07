import React, { useEffect, forwardRef } from "react";
import { usePlayerDevice } from "react-spotify-web-playback-sdk";

interface DeviceRef {
    playTrack: (track_id: string, position_ms: number) => void;
}

const PlayerDevice = React.forwardRef<DeviceRef>((ref) => {
    const device = usePlayerDevice();

    useEffect(() => {
        console.log(device)
    }, [])

    // need to figure out how playing songs will work
    
    const playTrack = async (track_id: string, position_ms: number) => {
        if (device == null) return;

        const response = await fetch(process.env.REACT_APP_SERVER_DOMAIN + `/spotify/play?device_id=${device.device_id}&track_id=${track_id}&position_ms=${position_ms}`);
        
        if (!response.ok) {
            console.error('There was an error starting playback');
        }
    }

    return (
        <>
        </>
    )
});

export default PlayerDevice;