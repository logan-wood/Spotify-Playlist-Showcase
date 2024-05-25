import { useEffect, useRef, useState } from "react";
import { Presentation, TrackQueueItem } from "../../@types/user";
import { DUMMY_PRESENTATION } from "./DUMMY_PRESENTATION";
import WebPlayback from "../player/Player";
import { useParams } from "react-router-dom";


interface PlayerRef {
    playTrack: (track_id: string, position_ms: number) => void;
    playerState: boolean;
}

const PlayPresentation = () => {
    const [token, setToken] = useState<string>('');
    const [imageURLs, setImageURLs] = useState<string[]>([]);
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [currentTrack, setCurrentTrack] = useState<TrackQueueItem | null>(null);
    const [ready, setReady] = useState<boolean>(false); // is everything needed for presentation healthy?

    const playerRef = useRef<PlayerRef>(null);
    
    const { presentation_id } = useParams<{ presentation_id: string }>();

    useEffect(() => {
        getPresentation();
        getImages();
        getAccessToken();
    }, [])

    // check and update ready boolean whenever relevant variables are updates
    useEffect(() => {
        checkReady();
    }, [presentation, token, imageURLs, playerRef.current?.playerState])

    useEffect(() => {
        console.log(`Player ready: ${ready}`);
    }, [ready])
    
    const getPresentation = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/presentations/${presentation_id}`)

            if (response.ok) {
                const data = await response.json();

                setPresentation(data)
            } else {
                console.error(`ERROR ${response.status}: There was an error fetching the presentation`);
            }
        } catch {
            console.error('ERROR: There was an error fetching the presentation');
        }
    }

    const getImages = async () => {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/presentations/images/${presentation_id}`);

        if (response.ok) {
            const data = await response.json();

            setImageURLs(data);
        } else {
            console.error(`ERROR: There was an error fetching presentaiton images.`);
        }
    }

    const getAccessToken = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_SERVER_DOMAIN + '/users/accessToken', { credentials: 'include' });
            const accessToken: string = await response.text();
            
            setToken(accessToken);
        } catch (error) {
            console.log(error);
        }
    }

    const checkReady = () => {
        if (presentation && token && imageURLs.length == presentation.track_queue.length && playerRef.current) {
            // check web playback can be reached and is ready
            setReady(playerRef.current.playerState);
        } else {
            console.error('checkReady(): ERROR: A condition required to play the presentation has not been met');
        }
    }

    const playTrack = async (track_id: string, position_ms: number) => {
        playerRef.current?.playTrack(track_id, position_ms);
    }

    return (
        <>
            <div>Presentation...</div>
            {ready && <p>Ready</p>}
            {token && ( <WebPlayback ref={playerRef} token={token} /> )}
        </>
    )
}

export default PlayPresentation;