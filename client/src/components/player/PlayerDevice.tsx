import { useEffect } from "react";
import { usePlayerDevice } from "react-spotify-web-playback-sdk";

interface props {
    track_id: string,
    position_ms: number
}

const PlayerDevice: React.FC<props> = ({ track_id, position_ms }) => {
    const device = usePlayerDevice();

    useEffect(() => {
        console.log(device)
    }, [])

    // need to figure out how playing songs will work
    
    const playSong = async () => {
        if (device == null) return;

        const response = await fetch(process.env.REACT_APP_SERVER_DOMAIN + `/spotify/play?device_id=${device.device_id}&track_id=${track_id}&position_ms=${position_ms}`);
        
        if (!response.ok) {
            console.error('There was an error starting playback');
        }
    }

    return (
        <></>
    )
}

export default PlayerDevice;