import React, { forwardRef, useImperativeHandle, Ref } from "react";
import { usePlayerDevice } from "react-spotify-web-playback-sdk";

interface DeviceRef {
    playTrack: (track_id: string, position_ms: number) => void;
    addToQueue: (track_id: string) => Promise<void>;
}

const PlayerDevice = forwardRef((props: {}, ref: Ref<DeviceRef>) => {
    const device = usePlayerDevice();

    useImperativeHandle(ref, () => ({
        playTrack: (track_id: string, position_ms: number) => { playTrack(track_id, position_ms) },
        addToQueue: async (track_id: string) => { addToQueue(track_id) }
    }), [device])
    
    const playTrack = async (track_id: string, position_ms: number) => {
        if (device == null) {
            console.error('ERROR: Error starting playback. Device is null');
            return;
        }

        const data = {
            track_id: track_id,
            position_ms: position_ms
        }

        const response = await fetch(process.env.REACT_APP_SERVER_DOMAIN + `/spotify/play?device_id=${device.device_id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        
        if (!response.ok) {
            console.error('There was an error starting playback');
        }

        return;
    }

    const addToQueue = async (track_id: string) => {
        if (device == null) {
            console.error('ERROR: Error starting playback. Device is null');
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/spotify/addToQueue?track_id=${track_id}&device_id=${device.device_id}`, {
            method: 'POST',
        });

        if (!response.ok) {
            console.error(`ERROR ${response.status}: ${response.statusText}`);
        }

        return;
    }

    return (
        <>
            device_id: {device?.device_id}
        </>
    )
});

export default PlayerDevice;