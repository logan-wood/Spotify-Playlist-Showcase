import React, { forwardRef, useImperativeHandle, Ref } from "react";
import { usePlayerDevice } from "react-spotify-web-playback-sdk";

interface DeviceRef {
    playTrack: (track_id: string, position_ms: number) => void;
}

const PlayerDevice = forwardRef((props: {}, ref: Ref<DeviceRef>) => {
    const device = usePlayerDevice();

    useImperativeHandle(ref, () => ({ playTrack: (track_id: string, position_ms: number) => playTrack(track_id, position_ms)}), [device])
    
    const playTrack = async (track_id: string, position_ms: number) => {
        if (device == null) {
            console.error('ERROR: Error starting playback. Device is null');
            return;
        }

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