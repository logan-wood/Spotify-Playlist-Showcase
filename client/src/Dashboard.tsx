import { useEffect, useState } from "react"
import { User } from "./types/user";
import React from "react";
import Error from "./Error";

function Dashboard() {
    const [error, setError] = useState<string>('');
    const [user, setUser] = useState<User>();
    const [isLoading, setIsLoading] = useState<Boolean>(true)

    useEffect(() => {
        const getSpotifyProfile = async () => {
            await fetch(process.env.REACT_APP_SERVER_DOMAIN + '/users/fromCookie')
            .then(async response => await response.json())
            .then(user => setUser(user))
            .catch(error => setError(error));

            setIsLoading(false);
        }

        getSpotifyProfile();
    }, [])

    

    // if an error occurs, show error page
    if (error != '') { return Error(error) };
    
    return (
        <div>
            {isLoading ? (
                <h1>Loading...</h1>
            ) : (
                <h1>Welcome back, {user?.username}</h1>
            )}
        </div>
    )
        
    
}

export default Dashboard