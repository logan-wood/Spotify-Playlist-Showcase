import { useEffect, useRef, useState } from "react";
import { Presentation, TrackQueueItem } from "../../@types/user";
import { DUMMY_PRESENTATION } from "./DUMMY_PRESENTATION";
import WebPlayback from "../player/Player";

interface props {
    presentation: Presentation
};

interface PlayerRef {
    playTrack: (track_id: string, position_ms: number) => void
}

const playPresentation = (props: props) => {
    const [token, setToken] = useState<string>('');
    const [imageURLs, setImageURLs] = useState<string[]>([]);
    const [currentTrack, setCurrentTrack] = useState<TrackQueueItem>(props.presentation.track_queue[0]);

    const playerRef = useRef<PlayerRef>(null);

    const getImages = async() => {
        const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/presentations/images/${props.presentation.id}`);

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
            console.error(`ERROR: error getting access token: ${error}`);
        }
    }

    const playTrack = async (track_id: string, position_ms: number) => {
        playerRef.current?.playTrack(track_id, position_ms);
        // got here
    }

    useEffect(() => {
        getImages();
        getAccessToken();
    }, [])

    // check access token and images were fetched successfully before starting presentation
    useEffect(() => {
        if (imageURLs.length == 0 || token == '') {
            console.log('loading presentation dependencies...')
            return;
        }


    })

    return (
        <>
            <></>
            {token && ( <WebPlayback ref={playerRef} token={token} /> )}
        </>
    )
}