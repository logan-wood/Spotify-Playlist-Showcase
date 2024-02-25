import React, { useState, useEffect } from 'react';

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
            console.log('onSpotifyPlaybackSDKReady()')
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

            console.log(player)

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
     * @param track_id 
     * @param position_ms 
     */
    const playTrack = async (track_id: string, position_ms: number) => {
        // check player and device id are valid
        if (player && deviceId != '') {
            const response = await fetch(process.env.REACT_APP_SERVER_DOMAIN + `/spotify/play?device_id=${deviceId}&track_id=${track_id}&position_ms=${position_ms}`);

            const responseData = await response.json();

            console.log(responseData)
        } else {
            console.log('device_id and player dont exist')
        }
    }

    return (
        <>  
            <button onClick={() => { playTrack("4e7JOKEUBdrK17PWgBex8Q?si=95b828cd2db04cbd", 0) }}>Play Track</button>
        </>
    )
}

export default WebPlayback;