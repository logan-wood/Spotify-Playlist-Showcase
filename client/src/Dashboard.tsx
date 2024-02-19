import { useEffect, useState } from "react"
import { User } from "./@types/user";
import ErrorComponent from "./components/ErrorComponent";
import './styles/dashboard.scss';
import Nav from "./components/Navigation";
import { getLoggedInUser } from "./utils/userUtils";
import { Playlist } from "./@types/spotify";

function Dashboard() {
    // state variables
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<Boolean>(true)
    const [user, setUser] = useState<User | null>(null);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        getLoggedInUser(setUser, setError);

        getPlaylists();

        setIsLoading(false);
    }, [])

    const getPlaylists = async () => {
        const response = await fetch(process.env.REACT_APP_SERVER_DOMAIN + '/spotify/playlists')
        
        if (response.ok) {
            const playlists = await response.json();

            setPlaylists(playlists)
        } else {
            setError('There as an error retrieving your playlists');
        }
    }   
    
    return (
        <>
            {/* Check if page is loading or if there is an error */}
            {isLoading && <h1>Loading...</h1>}
            {error && <ErrorComponent error={error} />}
            {!isLoading && (
                // page content
                <div className="dashboard">
                    <Nav isUserLoggedIn={true} />
                    <h1>Welcome back, {user?.username}</h1>
                    <section className='playlists'>
                        {playlists.map((playlist, index) => (
                            <div key={index} className="playlist-preview">
                                <h4>{playlist.name}</h4>
                                <img src={playlist.images[0].url}></img>
                            </div>
                        ))}
                    </section>
                </div>
            )}
        </>
    )
        
    
}

export default Dashboard