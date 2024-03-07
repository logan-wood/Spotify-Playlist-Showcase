import React, { useState, useEffect, forwardRef, useCallback, useRef } from 'react';
import { WebPlaybackSDK, usePlayerDevice, useWebPlaybackSDKReady } from 'react-spotify-web-playback-sdk';
import PlayerState from './PlayerState';
import PlayerDevice from './PlayerDevice';

interface WebPlaybackProps {
    token: string;
}

interface PlayerRef {
    playTrack: (track_id: string, position_ms: number) => void;
}

interface DeviceRef {
    playTrack: (track_id: string, position_ms: number) => void;
}

// This component is intended to be used for a whole showcase. Please alter to an array of objects with track_id, position_ms, and duration which will be played out to the user.

const WebPlayback = forwardRef<PlayerRef, WebPlaybackProps>((props, ref) => {
    const deviceRef = useRef<DeviceRef>(null);

    const playTrack = (track_id: string, position_ms: number) => {
        console.log('playTrack() called from <Player>')
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
            </div>
        </WebPlaybackSDK>
    );
});

export default WebPlayback;