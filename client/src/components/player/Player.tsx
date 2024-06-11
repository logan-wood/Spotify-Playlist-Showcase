import React, { useState, useEffect, forwardRef, useCallback, useRef, Ref, useImperativeHandle } from 'react';
import { WebPlaybackSDK, useSpotifyPlayer, useWebPlaybackSDKReady } from 'react-spotify-web-playback-sdk';
import PlayerDevice from './PlayerDevice';
import PlayerErrors from './PlayerErrors';
import PlayerController from './PlayerController';

interface PlayerRef {
    playTrack: (track_id: string, position_ms: number) => void;
}

interface DeviceRef {
    playTrack: (track_id: string, position_ms: number) => void;
    addToQueue: (track_id: string) => Promise<void>;
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
        playTrack: (track_id: string, position_ms: number) => { deviceRef.current?.playTrack(track_id, position_ms) }, 
        disconnect: () => { playerControllerRef.current?.disconnect() },
        togglePlay: () => { playerControllerRef.current?.togglePlay() },
        nextTrack: (position_ms: number) => { playerControllerRef.current?.nextTrack(position_ms) },
        addToQueue: (device_id: string) => { deviceRef.current?.addToQueue(device_id) } 
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
            <PlaybackWrapper setIsPlaybackReady={props.setIsPlaybackReady}>
                <PlayerDevice ref={deviceRef} />
                <PlayerErrors />
                <PlayerController ref={playerControllerRef} />
            </PlaybackWrapper>
        </WebPlaybackSDK>
    );
});

const PlaybackWrapper = ({ setIsPlaybackReady, children }: { setIsPlaybackReady: (ready: boolean) => void, children: React.ReactNode }) => {
    const isReady = useWebPlaybackSDKReady();

    useEffect(() => {
        setIsPlaybackReady(isReady);
    }, [isReady, setIsPlaybackReady]);

    return <>{children}</>
}

export default WebPlayback;