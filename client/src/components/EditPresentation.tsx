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

    useEffect(() => {
        console.log(presentation)
    }, [presentation])

    const getPresentation = async () => {
        try {
            const response = await fetch(process.env.REACT_APP_SERVER_DOMAIN + `/presentations/${props.playlist.id}`, { credentials: 'include' });

            if (response.ok) {
                const data = await response.json();
                const track_queue = JSON.parse(data.track_queue);

                setPresentation({
                    id: data.id,
                    playlist_id: data.playlist_id,
                    track_queue: track_queue
                });
            }

        } catch(error) {
            console.error('An error occured fetching the presentation: ' + error)
        }
    }

    return (
        <div>
            <div className="edit-presentation">
                
                <button>save</button>
                <button>exit</button>
            </div>
        </div>
    )
}

export default EditPresentation;