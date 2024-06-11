import { useEffect, useRef, useState } from "react";
import { Presentation, TrackQueueItem } from "../../@types/user";
import WebPlayback from "../player/Player";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../Navigation";


interface PlayerRef {
    playTrack: (track_id: string, position_ms: number) => Promise<void>;
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

    const preparePresentation = async () => {
        if (!presentationReady || !presentation) {
            console.error('ERROR: not ready to start presentation')
            return;
        }

        // set position to first track in presentation
        let queuePosition = 0; // seperate from the state, for queueing objects
        let current: TrackQueueItem = presentation.track_queue[position]

        // play first track
        await playerRef.current?.playTrack(current.track_id, current.from)
        setCurrentImageURL(current.image_url)
        queuePosition++;

        // add all other items to queue
        while (queuePosition < presentation.track_queue.length) {
            const current = presentation.track_queue[queuePosition];

            await playerRef.current?.addToQueue(current.track_id);

            queuePosition++;
        }
    }


    const nextTrack = () => {
        const presentationLength = presentation?.track_queue.length as number;

        if (position >= presentationLength - 1) {
            // reached end of presentation
            playerRef.current?.disconnect();
            setCurrentImageURL('https://media.newyorker.com/photos/59095bb86552fa0be682d9d0/master/pass/Monkey-Selfie.jpg');

            return;
        }

        const nextTrack = presentation?.track_queue[position + 1] as TrackQueueItem;
        setPosition(position + 1);

        // play next track
        playerRef.current?.nextTrack(nextTrack.from);
        setCurrentImageURL(nextTrack.image_url);
    }

    return(
        <>
            <Nav isUserLoggedIn={true}></Nav>
            <div>Presentation...</div>
            {presentationReady && (
                <div>
                    <p>Ready</p>
                    <button onClick={preparePresentation}>Start</button>
                    <button onClick={() => nextTrack()}>next</button>
                    {currentImageURL != '' && <img src={currentImageURL} alt='Album Art'></img>}
                </div>
            )}

            {token && ( <WebPlayback ref={playerRef} token={token} setIsPlaybackReady={(isReady: boolean) => { checkPresentationDependencies(isReady)}} /> )}
        </>
    )
}

export default PlayPresentation;