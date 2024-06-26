import React, { forwardRef, useImperativeHandle, Ref, useEffect } from "react";
import { usePlayerDevice } from "react-spotify-web-playback-sdk";

interface DeviceRef {
    playTrack: (track_id: string, position_ms: number) => Promise<void>;
    addToQueue: (track_id: string) => Promise<void>;
    deviceReady: () => boolean;
}

const PlayerDevice = forwardRef((props: { setIsPlaybackReady: (isReady: boolean) => void }, ref: Ref<DeviceRef>) => {
    const device = usePlayerDevice();

    useEffect(() => {
        props.setIsPlaybackReady(device?.status == 'ready');
    }, [device?.status]);

    useImperativeHandle(ref, () => ({
        playTrack: async (track_id: string, position_ms: number) => { await playTrack(track_id, position_ms) },
        addToQueue: async (track_id: string) => { await addToQueue(track_id) },
        deviceReady: () => { return device?.status == "ready" }
    }), [device])
    
    const playTrack = async (track_id: string, position_ms: number): Promise<void> => {
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

    const addToQueue = async (track_id: string): Promise<void> => {
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