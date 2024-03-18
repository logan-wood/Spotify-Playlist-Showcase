import { useEffect, useState } from "react";
import { Playlist } from "../@types/spotify";
import { Presentation } from "../@types/user";

interface Props {
    playlist: Playlist
}

const EditPresentation = (props: Props) => {
    const [presentation, setPresentation] = useState<Presentation | null>(null);

    useEffect(() => {
        getPresentation()
    }, [])

    const getPresentation = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_SERVER_DOMAIN + '/presentation?playlist_id=' + props.playlist.id);

            if (response.ok) {
                const data = await response.json();
                console.log(data)
            }

        } catch(error) {
            console.error('An error occured fetching the presentation: ' + error)
        }
    }

    return (
        <div>
            <div className="edit-presentation">
                {props.playlist.tracks.items.map((track, index) => {
                    console.log(track.track.name)
                    return (
                    <div key={index} className="track">
                        <p>{track.track.name}</p>
                    </div>
                    )
                })}
                <button>save</button>
                <button>exit</button>
            </div>
        </div>
    )
}

export default EditPresentation;