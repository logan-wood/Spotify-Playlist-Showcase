import { useErrorState } from "react-spotify-web-playback-sdk"


const PlayerErrors = () => {
    const errorState = useErrorState();

    if (errorState === null) return null;


    return (
        <p>Error: {errorState.message}</p>
    )
}

export default PlayerErrors