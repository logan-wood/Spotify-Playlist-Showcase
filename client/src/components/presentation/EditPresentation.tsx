import { useEffect, useState } from "react";
import { Playlist, Track } from "../../@types/spotify";
import { Presentation, TrackQueueItem } from "../../@types/user";

interface Props {
    playlist: Playlist
    presentation: Presentation
    close: () => void
}

const EditPresentation = (props: Props) => {
    const [trackQueue, setTrackQueue] = useState<TrackQueueItem[]>([]);
    const [preExistingIDs, setPreExistingIDs] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const presentation = props.presentation;

    useEffect(() => {
        if (presentation) { 
            setTrackQueue(presentation.track_queue);
        } else {
            console.error('ERROR: Presentation is empty');
        }
    }, []);

    // Create array of IDs already in presentation, to avoid duplicate rendering of tracks
    useEffect(() => {
        if (trackQueue) {
            setPreExistingIDs(trackQueue.map(obj => obj.track_id));
        }
    }, [trackQueue]);

    /**
     * Adds the input `track` to the current presentation. This only affects the local variable, and the data will still need to be saved to the database before exiting.
     * 
     * @param track the track to be added to the presentation
     */
    const addToPresentation = (track: Track): void => {
        console.log(track)
        if (!presentation) {
            console.log(`There was an error adding ${track.name} to the presentation`);
            return
        };

        // add new item to track queue, from 0ms to max ms
        const newTrackQueueItem: TrackQueueItem = { 
            track_id: track.id,
            track_name: track.name,
            from: 0,
            to: track.duration_ms,
            track_length: track.duration_ms,
            image_url: track.album.images[0].url 
        };

        setTrackQueue([...trackQueue, newTrackQueueItem])
    };

    const removeFromPresentation = (item: TrackQueueItem): void => {
        if (!presentation) {
            console.error(`There was an error removing ${item.track_name} from the presentation`);
            return
        }

        // create new track queue object by filtering array against element to be removed
        const newTrackQueue = trackQueue.filter((curItem: TrackQueueItem) => { return !(Object.is(curItem, item)) });

        setTrackQueue(newTrackQueue)
    }

    /**
     * Move a trackQueueItem object 1 down in the trackQueue. Currently only moves down by 1.
     * TODO: Allow user to specify index they want to move the track to. (i.e. allow drag and drop)
     * 
     * @param item The item to be moved down in the queue
     */
    const moveDown = (item: TrackQueueItem): void => {
        // error checking, these should never happen
        if (!presentation) {
            console.error(`There was an error moving ${item.track_name} down.`);
        }
        
        let i = 0;
        const itemToMove: TrackQueueItem = trackQueue.find((curItem: TrackQueueItem) => {
            const match = Object.is(curItem, item); // returns 'true' if correct track is found.

            if (match) {
                return match // return without incrementing i
            }

            // increment i and return false (iterate again)
            i++;
            return false;
        }) as TrackQueueItem;
        
        // null check before swapping
        if (itemToMove) {
            let newTrackQueue = Array.from(trackQueue);

            const temp = newTrackQueue[i + 1];
            newTrackQueue[i + 1] = itemToMove;
            newTrackQueue[i] = temp;

            setTrackQueue(newTrackQueue);
        } else {
            console.error(`ERROR: Error moving ${item.track_name} down.`);
        }
    }

    /**
     * Move a trackQueueItem object 1 up in the trackQueue. Currently only moves up by 1.
     * TODO: Allow user to specify index they want to move the track to. (i.e. allow drag and drop)
     * 
     * @param item The item to be moved down in the queue
     */
    const moveUp = (item: TrackQueueItem): void => {
        // error checking, these should never happen
        if (!presentation) {
            console.error(`There was an error moving ${item.track_name} down.`);
        }
        
        let i = 0;
        const itemToMove: TrackQueueItem = trackQueue.find((curItem: TrackQueueItem) => {
            const match = Object.is(curItem, item); // returns 'true' if correct track is found.

            if (match) {
                return match // return without incrementing i
            }

            // increment i and return false (iterate again)
            i++;
            return false;
        }) as TrackQueueItem;
        
        // null check before swapping
        if (itemToMove) {
            let newTrackQueue = Array.from(trackQueue);

            const temp = newTrackQueue[i -1];
            newTrackQueue[i - 1] = itemToMove;
            newTrackQueue[i] = temp;

            setTrackQueue(newTrackQueue);
        } else {
            console.error(`ERROR: Error moving ${item.track_name} up.`);
        }
    }

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
                    track_queue: trackQueue
                }),
            });

            if (response.ok) {
                setSuccessMessage('Presentation saved.')
            } else {
                console.error('There was an error saving the playlist');
            }
        } catch(error) {
            console.error(error);
        }
    }

    return (
        <div>
            <div className="edit-presentation">
                {/* Tracks already in presentation */}
                {trackQueue && trackQueue.map((track: TrackQueueItem, index) => {
                    return (
                        <div key={index}>
                            <div>{track.track_name}</div>
                            <button onClick={() => { removeFromPresentation(track) }}>-</button>
                            {index != 0 && <button onClick={() => moveUp(track)}>↑</button>}
                            {index != trackQueue.length - 1 && <button onClick={() => moveDown(track)}>↓</button>}

                            <label htmlFor='from_ms'>From:</label>
                            <input type='number' name='from_ms' id='from_ms' defaultValue={track.from} onChange={event => track.from = event.target.value as unknown as number} />

                            <label htmlFor='to_ms'>To:</label>
                            <input type='number' name='to_ms' id='to_ms' defaultValue={track.to} onChange={event => track.to = event.target.value as unknown as number} />
                        </div>
                    )
                })}
                {/* // Tracks not yet in presentation, includes logic to check if track from spotify playlist is in playlist */}
                {preExistingIDs && (
                    props.playlist.tracks.items.map((track, index) => {
                        if (!preExistingIDs?.includes(track.track.id)) {
                            return (
                                <div key={index}>
                                    <div>{track.track.name}</div>
                                    <button onClick={() => { addToPresentation(track.track) }}>+</button>
                                </div>
                            )
                        }

                        return (<div key={index}></div>)
                    })
                )}
                <button onClick={() => { savePresentation() }}>save</button>
                <button onClick={() => { props.close() }}>exit</button>
                { successMessage && <p>{successMessage}</p>}
            </div>
        </div>
    )
}

export default EditPresentation;