import { Ref, forwardRef, useImperativeHandle } from "react";
import { useSpotifyPlayer } from "react-spotify-web-playback-sdk";

interface PlayerControllerRef {
    disconnect: () => void;
    togglePlay: () => void;
    nextTrack: (position_ms: number) => void;
}

const PlayerController = forwardRef((props: {}, ref: Ref<PlayerControllerRef>) => {
    const player = useSpotifyPlayer();
    player?.getCurrentState()

    useImperativeHandle(ref, () => ({ 
        disconnect: () => { player?.disconnect() },
        togglePlay: () => { togglePlay() },
        nextTrack: (position_ms: number) => { nextTrack(position_ms) }
    }), [player]);

    const togglePlay = () => {
        player?.togglePlay();
    }

    const nextTrack = (position_ms: number) => {
        player?.nextTrack();
        player?.seek(position_ms);
    }

    /**
     * To be implemented.
     * @param ms_to check if track has elapsed past this point
     * @returns true if track has elapsed past ms_to
     */
    const checkElapsed = (ms_to: number): boolean => {
        return false;
    }

    return <></>
});

export default PlayerController;