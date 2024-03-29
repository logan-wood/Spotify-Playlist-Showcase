import { useWebPlaybackSDKReady } from "react-spotify-web-playback-sdk";

const PlayerState = () => {
    const playerReady = useWebPlaybackSDKReady();
    
    if (!playerReady) return <div>Loading...</div>
    
    return null;
}

export default PlayerState;