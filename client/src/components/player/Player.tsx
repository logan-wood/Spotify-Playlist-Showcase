import React, { useState, useEffect, forwardRef, useCallback, useRef, Ref, useImperativeHandle } from 'react';
import { WebPlaybackSDK, usePlayerDevice, useWebPlaybackSDKReady } from 'react-spotify-web-playback-sdk';
import PlayerState from './PlayerState';
import PlayerDevice from './PlayerDevice';
import PlayerErrors from './PlayerErrors';

interface PlayerRef {
    playTrack: (track_id: string, position_ms: number) => void;
}

interface DeviceRef {
    playTrack: (track_id: string, position_ms: number) => void;
}

const WebPlayback = forwardRef((props: { token: string }, ref: Ref<PlayerRef>) => {
    const deviceRef = useRef<DeviceRef>(null);

    useImperativeHandle(ref, () => ({ playTrack: (track_id: string, position_ms: number) => playTrack(track_id, position_ms)}), [])
    const playTrack = (track_id: string, position_ms: number) => {
        deviceRef.current?.playTrack(track_id, position_ms);
    }

    const getOAuthToken: Spotify.PlayerInit["getOAuthToken"] = useCallback(
        callback => callback(props.token),
        [props.token]
    );

    return (
        <WebPlaybackSDK
            initialDeviceName='Playlist Showcase Player'
            getOAuthToken={getOAuthToken}
            connectOnInitialized={true}
            initialVolume={0.5}
        >
            <div>
                <PlayerState />
                <PlayerDevice ref={deviceRef} />
                <PlayerErrors />
            </div>
        </WebPlaybackSDK>
    );
});

export default WebPlayback;