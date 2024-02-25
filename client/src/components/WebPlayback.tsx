import React, { useState, useEffect } from 'react';

type PlaybackRequestBody = {
    context_uri: string;
    position_ms: number;
};

const WebPlayback = (props: { token: string }) => {
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

        window.onSpotifyWebPlaybackSDKReady = () => {
            const token = props.token;
            const player = new Spotify.Player({
                name: 'Playlist Showcase Audio',
                getOAuthToken: cb => { cb(token) },
                volume: 0.5
            });
            setPlayer(player);
        };

        if (player) {
            // error handling
            player.on('initialization_error', ({ message }) => {
                console.error('Failed to initialize', message);
                return;
            });
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

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with device ID ', device_id);
                setDeviceId(device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            player.connect();
        };
    }, []);

    /**
     * Controls playback on spotify, which should now be connected to this device.
     * 
     * @param context_uri The song or playlist to be played. See Spotify Docs
     * @param position_ms 
     */
    const playTrack = (context_uri: string, position_ms: number): void => {
        // check player and device id are valid
        if (player && deviceId != '') {
            const data: PlaybackRequestBody = {
                context_uri: context_uri,
                position_ms: position_ms
            };

            fetch(process.env.REACT_APP_SERVER_DOMAIN + '/spotify/playback/play', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        }
    }

    return (
        <>  
            <button onClick={playTrack("spotify:traclk:4e7JOKEUBdrK17PWgBex8Q?si=95b828cd2db04cbd", 0)}>Play Track</button>
        </>
    )
}

export default WebPlayback;