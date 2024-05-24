import React, { useState, useEffect, forwardRef, useCallback, useRef, Ref, useImperativeHandle } from 'react';
import { WebPlaybackSDK, useWebPlaybackSDKReady } from 'react-spotify-web-playback-sdk';
import PlayerDevice from './PlayerDevice';
import PlayerErrors from './PlayerErrors';

interface PlayerRef {
    playTrack: (track_id: string, position_ms: number) => void;
    playerState: boolean;
}

interface DeviceRef {
    playTrack: (track_id: string, position_ms: number) => void;
}

const WebPlayback = forwardRef((props: { token: string }, ref: Ref<PlayerRef>) => {
    const deviceRef = useRef<DeviceRef>(null);
    const [isPlaybackReady, setIsPlaybackReady] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({ 
        playTrack: (track_id: string, position_ms: number) => {
            deviceRef.current?.playTrack(track_id, position_ms);
        }, 
        playerState: isPlaybackReady
    }), [isPlaybackReady]);

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
            <PlaybackWrapper setIsPlaybackReady={setIsPlaybackReady}>
                <PlayerDevice ref={deviceRef} />
                <PlayerErrors />
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