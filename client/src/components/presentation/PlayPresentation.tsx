import { useEffect, useRef, useState } from "react";
import { Presentation, TrackQueueItem } from "../../@types/user";
import WebPlayback from "../player/Player";
import { useParams } from "react-router-dom";


interface PlayerRef {
    playTrack: (track_id: string, position_ms: number) => void;
}

const PlayPresentation = () => {
    const [token, setToken] = useState<string>('');
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [currentImageURL, setCurrentImageURL] = useState<string>('');
    const [presentationReady, setPresentationReady] = useState<boolean>(false); // is everything needed for presentation healthy?

    const playerRef = useRef<PlayerRef>(null);
    
    const { presentation_id } = useParams<{ presentation_id: string }>();

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

    const startPresentation = async () => {
        if (!presentationReady || !presentation) {
            console.error('ERROR: not ready to start presentation')
            return;
        }

        // set position to first track in presentation
        let position = 0;
        let current: TrackQueueItem = presentation.track_queue[position]

        // play presentation logic
        while (position < presentation.track_queue.length) {
            console.log('playing ' + current.track_name)
            playTrack(current.track_id, current.from);
            setCurrentImageURL(current.image_url);

            // await wait(current.to - current.from);
            await wait(15000)

            position++;
            current = presentation.track_queue[position];
        }

        // presentation finished
    }

    const wait = (ms: number) => {
        return new Promise<void>((resolve) => {
            const timeout = setTimeout(() => {
                clearTimeout(timeout);
                resolve();
            }, ms);

            const onNext = () => {
                clearTimeout(timeout);
                resolve();
                document.removeEventListener('manualNext', onNext);
            };

            document.addEventListener('manualNext', onNext)
        });
    }

    return(
        <>
            <div>Presentation...</div>
            {presentationReady && (
                <div>
                    <p>Ready</p>
                    <button onClick={startPresentation}>Start</button>
                    {currentImageURL != '' && <img src={currentImageURL} alt='Album Art'></img>}
                </div>
            )}

            {token && ( <WebPlayback ref={playerRef} token={token} setIsPlaybackReady={(isReady: boolean) => { checkPresentationDependencies(isReady)}} /> )}
        </>
    )
}

export default PlayPresentation;