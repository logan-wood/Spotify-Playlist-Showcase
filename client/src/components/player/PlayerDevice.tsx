import React, { useEffect, forwardRef, useImperativeHandle, Ref, useRef } from "react";
import { usePlayerDevice } from "react-spotify-web-playback-sdk";

interface DeviceRef {
    playTrack: (track_id: string, position_ms: number) => void;
}

const PlayerDevice = forwardRef((props: {}, ref: Ref<DeviceRef>) => {
    const device = usePlayerDevice();
    // const deviceRef = useRef<DeviceRef>(null);

    useImperativeHandle(ref, () => ({ playTrack: (track_id: string, position_ms: number) => playTrack(track_id, position_ms)}), [device])
    // need to figure out how playing songs will work
    
    const playTrack = async (track_id: string, position_ms: number) => {
        console.log({ track_id, position_ms })
        console.log(device)
        if (device == null) return;

        const response = await fetch(process.env.REACT_APP_SERVER_DOMAIN + `/spotify/play?device_id=${device.device_id}&track_id=${track_id}&position_ms=${position_ms}`);
        console.log(response)
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