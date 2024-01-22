import { useEffect, useState } from "react"
import { User } from "./types/user";
import React from "react";
import ErrorComponent from "./components/ErrorComponent";

function Dashboard() {
    const [error, setError] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<Boolean>(true)

    useEffect(() => {
        console.log(user)

        const getSpotifyProfile = async () => {
            await fetch(process.env.REACT_APP_SERVER_DOMAIN + '/users/fromCookie')
            .then(async response => await response.json())
            .then((user) => {
                setUser(user);
                setIsLoading(false);
            })
            .catch((error) => {
                setError('There was an error loading your profile. Please try again later.');
                console.error('Error loading account data: ' + error);
            });
        }

        getSpotifyProfile();
    }, [])
    
    return (
        <div>
            {/* Check if page is loading or if there is an error */}
            {isLoading && <h1>Loading...</h1>}
            {error && <ErrorComponent error={error} />}
            {!isLoading && (
                // page content
                <h1>Welcome back, {user?.username}</h1>
            )}
        </div>
    )
        
    
}

export default Dashboard