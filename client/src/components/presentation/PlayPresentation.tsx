import { useEffect, useRef, useState } from "react";
import { Presentation, TrackQueueItem } from "../../@types/user";
import WebPlayback from "../player/Player";
import { useNavigate, useParams } from "react-router-dom";


interface PlayerRef {
    playTrack: (track_id: string, position_ms: number) => void;
    disconnect: () => void;
    togglePlay: () => void;
    nextTrack: (position_ms: number) => void;
    addToQueue: (device_id: string) => Promise<void>;
}

const PlayPresentation = () => {
    const [token, setToken] = useState<string>('');
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [position, setPosition] = useState<number>(0)
    const [currentImageURL, setCurrentImageURL] = useState<string>('');
    const [presentationReady, setPresentationReady] = useState<boolean>(false); // is everything needed for presentation healthy?

    const playerRef = useRef<PlayerRef>(null);
    
    const { presentation_id } = useParams<{ presentation_id: string }>();

    const navigate = useNavigate();

    useEffect(() => {
        getPresentation();
        getAccessToken();
    }, [])
    
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

    const getAccessToken = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_SERVER_DOMAIN + '/users/accessToken', { credentials: 'include' });
            const accessToken: string = await response.text();
            
            setToken(accessToken);
        } catch (error) {
            console.log(error);
        }
    }

    const checkPresentationDependencies = (isWebPlayerReady: boolean) => {
        if (presentation) {
            setPresentationReady(isWebPlayerReady);
        } else {
            setPresentationReady(false);
            console.error('checkReady(): ERROR: A condition required to play the presentation has not been met');
        }
    }

    const playTrack = async (track_id: string, position_ms: number) => {
        playerRef.current?.playTrack(track_id, position_ms);
    }

    const preparePresentation = async () => {
        if (!presentationReady || !presentation) {
            console.error('ERROR: not ready to start presentation')
            return;
        }

        // set position to first track in presentation
        let queuePosition = 0; // seperate from the state, for queueing objects
        let current: TrackQueueItem = presentation.track_queue[position]

        // play first track
        console.log(`Playing ${current.track_name}`)
        playTrack(current.track_id, current.from)
        setCurrentImageURL(current.image_url)
        queuePosition++;

        // add all other items to queue
        while (queuePosition < presentation.track_queue.length) {
            const current = presentation.track_queue[queuePosition];
            console.log(`Adding ${current.track_name} to the queue`);

            await playerRef.current?.addToQueue(current.track_id);

            queuePosition++;
        }
    }


    const nextTrack = () => {
        const presentationLength = presentation?.track_queue.length as number;

        if (position >= presentationLength) {
            // reached end of presentation
            playerRef.current?.disconnect();
            setCurrentImageURL('https://media.cnn.com/api/v1/images/stellar/prod/160107100400-monkey-selfie.jpg?q=w_2912,h_1638,x_0,y_0,c_fill');
        }

        const nextTrack = presentation?.track_queue[position + 1] as TrackQueueItem;

        // play next track
        playerRef.current?.nextTrack(nextTrack.from);
        setCurrentImageURL(nextTrack.image_url);
        
    }

    return(
        <>
            <div>Presentation...</div>
            {presentationReady && (
                <div>
                    <p>Ready</p>
                    <button onClick={preparePresentation}>Start</button>
                    <button onClick={nextTrack}>next</button>
                    {currentImageURL != '' && <img src={currentImageURL} alt='Album Art'></img>}
                </div>
            )}

            {token && ( <WebPlayback ref={playerRef} token={token} setIsPlaybackReady={(isReady: boolean) => { checkPresentationDependencies(isReady)}} /> )}
        </>
    )
}

export default PlayPresentation;