import React, { useState, useEffect, forwardRef, useCallback } from 'react';
import { WebPlaybackSDK, usePlayerDevice, useWebPlaybackSDKReady } from 'react-spotify-web-playback-sdk';
import PlayerState from './PlayerState';
import PlayerDevice from './PlayerDevice';

interface props {
    token: string;
}

// This component is intended to be used for a whole showcase. Please alter to an array of objects with track_id, position_ms, and duration which will be played out to the user.

const WebPlayback: React.FC<props> = ({ token }) => {
    const getOAuthToken: Spotify.PlayerInit["getOAuthToken"] = useCallback(
        callback => callback(token),
        [token]
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
            </div>
        </WebPlaybackSDK>
    );
}

export default WebPlayback;