import { useEffect, useState } from "react";
import { Playlist, Track } from "../@types/spotify";
import { Presentation, TrackQueueItem } from "../@types/user";

interface Props {
    playlist: Playlist,
    close: () => void
}

const EditPresentation = (props: Props) => {
    const [presentation, setPresentation] = useState<Presentation | null>(null);
    const [trackQueue, setTrackQueue] = useState<TrackQueueItem[]>([]);
    const [preExistingIDs, setPreExistingIDs] = useState<string[]>([]);

    useEffect(() => {
        getPresentation()
    }, []);

    // set track queue once presentation is recieved from server
    useEffect(() => {
        if (presentation) { 
            setTrackQueue(presentation.track_queue);
        }
    }, [presentation]);

    // Create array of IDs already in presentation, to avoid duplicate rendering of tracks
    useEffect(() => {
        if (trackQueue) {
            setPreExistingIDs(trackQueue.map(obj => obj.track_id));
        }
    }, [trackQueue]);

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
            console.error('An error occured fetching the presentation: ' + error);
        };
    };

    /**
     * Adds the input `track` to the current presentation. This only affects the local variable, and the data will still need to be saved to the database before exiting.
     * 
     * @param track the track to be added to the presentation
     */
    const addToPresentation = (track: Track): void => {
        if (!presentation) {
            console.log(`There was an error adding ${track.name} to the presentation`);
        };

        // add new item to track queue, from 0ms to max ms
        const newTrackQueueItem: TrackQueueItem = { track_id: track.id, track_name: track.name, from: 0, to: track.duration_ms };
        
        setTrackQueue([...trackQueue, newTrackQueueItem])
    };

    /**
     * Sends the updated `trackQueue` object to the server in a PATCH request
     */
    const savePresentation = async (): Promise<void> => {
        if (!presentation) {
            console.error('There is no presentation to save');
            return;
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/presentations/${presentation.id}`, {
                method: 'PATCH',
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    track_queue: JSON.stringify(trackQueue)
                }),
            });

            if (!response.ok) {
                console.error('There was an error saving the playlist');
            };
        } catch(error) {
            console.error(error);
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
                                    <button onClick={() => { addToPresentation(track.track) }}>+</button>
                                </div>
                            )
                        }

                        return (<></>)
                    })
                )}
                <button onClick={() => { savePresentation() }}>save</button>
                <button onClick={() => { props.close() }}>exit</button>
            </div>
        </div>
    )
}

export default EditPresentation;