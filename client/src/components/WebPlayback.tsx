import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';

interface props {
    token: string;
    playTrack: (trackId: string, positionMs: number) => void;
    onPlayerStatusChange: (status: boolean) => void
}

const WebPlayback: React.ForwardRefRenderFunction<any, props> = (props, ref) => {
    const [player, setPlayer] = useState<Spotify.Player | null>(null);
    const [deviceId, setDeviceId] = useState<string>('');

    useEffect(() => {
        // load script
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;

        script.onerror = (error) => {
            console.error('Error loading script: ' + error);
        }

        document.body.appendChild(script);

        initializePlayer();

        // cleanup code, disconnect player
        return () => {
            props.onPlayerStatusChange(false);
            player?.disconnect();
        };
    }, []);

    useEffect(() => {
        if (player) {
            // error handling
            player.on('authentication_error', ({ message }) => {
                console.error('Failed to authenticate', message);
                return;
            });
            player.on('account_error', ({ message }) => {
                console.error('Failed to validate Spotify account', message);
                return;
            });
            player.on('playback_error', ({ message }) => {
                console.error('Failed to perform playback', message);
                return;
            });

            // add listeners
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with device ID ', device_id);
                setDeviceId(device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
                props.onPlayerStatusChange(false);
            });

            // connect player
            player.connect();

            props.onPlayerStatusChange(true);
        }
    }, [player])


    const constructPlayerObject = async (): Promise<Spotify.Player> => {
        return new Promise((resolve) => {
            window.onSpotifyWebPlaybackSDKReady = () => {
                const token = props.token;
                const newPlayer = new Spotify.Player({
                    name: 'Playlist Showcase Audio',
                    getOAuthToken: cb => { cb(token) },
                    volume: 0.5
                });

                resolve(newPlayer);
            };
        })
    };

    const initializePlayer = async () => {
        try {
            const newPlayer: Spotify.Player = await constructPlayerObject();

            if (newPlayer) {
                setPlayer(newPlayer);
            } else {
                console.error('Player not created successfully.');
            }
        } catch (error) {
            console.error('Error initializing player:', error);
        }
    };
        
    /**
     * Controls playback on spotify, which should now be connected to this device.
     * 
     * @param track_id 
     * @param position_ms 
     */
    const playTrack = async (track_id: string, position_ms: number) => {
        // check player and device id are valid
        if (player && deviceId != '') {
            const response = await fetch(process.env.REACT_APP_SERVER_DOMAIN + `/spotify/play?device_id=${deviceId}&track_id=${track_id}&position_ms=${position_ms}`);

            if (!response.ok) {
                console.error('There was an error starting playback');
            }
        } else {
            console.log('device_id and player dont exist')
        }
    }

    // Expose playTrack function via ref
    useImperativeHandle(ref, () => ({
        playTrack,
        
    }));

    return (
        <>  
        </>
    )
}

export default forwardRef(WebPlayback);