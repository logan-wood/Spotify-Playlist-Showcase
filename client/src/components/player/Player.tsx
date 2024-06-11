import React, { useState, useEffect, forwardRef, useCallback, useRef, Ref, useImperativeHandle } from 'react';
import { WebPlaybackSDK, useSpotifyPlayer, useWebPlaybackSDKReady } from 'react-spotify-web-playback-sdk';
import PlayerDevice from './PlayerDevice';
import PlayerErrors from './PlayerErrors';
import PlayerController from './PlayerController';

interface PlayerRef {
    playTrack: (track_id: string, position_ms: number) => Promise<void>;
}

interface DeviceRef {
    playTrack: (track_id: string, position_ms: number) => Promise<void>;
    addToQueue: (track_id: string) => Promise<void>;
    deviceReady: () => boolean;
}

interface PlayerControllerRef {
    disconnect: () => void;
    togglePlay: () => void;
    nextTrack: (position_ms: number) => void;
}

const WebPlayback = forwardRef((props: { token: string, setIsPlaybackReady: (isReady: boolean) => void }, ref: Ref<PlayerRef>) => {
    const deviceRef = useRef<DeviceRef>(null);
    const playerControllerRef = useRef<PlayerControllerRef>(null);

    useImperativeHandle(ref, () => ({ 
        playTrack: async (track_id: string, position_ms: number) => { await deviceRef.current?.playTrack(track_id, position_ms) }, 
        addToQueue: async (device_id: string) => { await deviceRef.current?.addToQueue(device_id) },
        disconnect: () => { playerControllerRef.current?.disconnect() },
        togglePlay: () => { playerControllerRef.current?.togglePlay() },
        nextTrack: (position_ms: number) => { playerControllerRef.current?.nextTrack(position_ms) },
    }), []);

    const getOAuthToken: Spotify.PlayerInit["getOAuthToken"] = useCallback(
        callback => callback(props.token),
        [props.token]
    );

    return (
        <WebPlaybackSDK
            initialDeviceName='Playlist Showcase Player'
            getOAuthToken={getOAuthToken}
            connectOnInitialized={true

            }
            initialVolume={0.5}
        >
            <PlayerDevice ref={deviceRef} setIsPlaybackReady={props.setIsPlaybackReady} />
            <PlayerErrors />
            <PlayerController ref={playerControllerRef} />
        </WebPlaybackSDK>
    );
});

export default WebPlayback;