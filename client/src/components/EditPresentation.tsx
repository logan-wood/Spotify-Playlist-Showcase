import { useEffect, useState } from "react";
import { Playlist, Track } from "../@types/spotify";
import { Presentation, TrackQueueItem } from "../@types/user";

interface Props {
    playlist: Playlist
}

const EditPresentation = (props: Props) => {
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [trackQueue, setTrackQueue] = useState<TrackQueueItem[]>();
    const [preExistingIDs, setPreExistingIDs] = useState<string[]>();

    useEffect(() => {
        getPresentation()
    }, [])

    // set track queue once presentation is recieved from server
    useEffect(() => {
        if (presentation) { 
            setTrackQueue(presentation.track_queue);
        }
    }, [presentation])

    // Create array of IDs already in presentation, to avoid duplicate rendering of tracks
    useEffect(() => {
        if (trackQueue) {
            setPreExistingIDs(trackQueue.map(obj => obj.track_id));
        }
    }, [trackQueue])

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
                {/* Tracks already in presentation */}
                {trackQueue && trackQueue.map((track, index) => {
                    return (
                        <div key={index}>
                            <div>{track.track_name}</div>
                            {index != 0 && <button>↑</button>}
                            {index != trackQueue.length - 1 && <button>↓</button>}
                        </div>
                    )
                })}
                {/* // Tracks not yet in presentation, includes logic to check if track from spotify playlist is in playlist */}
                {preExistingIDs && (
                    props.playlist.tracks.items.map((track, index) => {
                        if (!preExistingIDs?.includes(track.track.id)) {
                            return (
                                <div>
                                    <div>{track.track.name}</div>
                                    <button>+</button>
                                </div>
                            )
                        }

                        return (<></>)
                    })
                )}
                <button>save</button>
                <button>exit</button>
            </div>
        </div>
    )
}

export default EditPresentation;