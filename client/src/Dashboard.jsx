import { useEffect } from "react"

function Dashboard() {
    useEffect(() => {
        getSpotifyProfile();
    })

    const getSpotifyProfile = async () => {
        const response = await fetch(process.env.REACT_APP_SERVER_DOMAIN + '/users/fromCookie');
        
        const data = await response.json();
        console.log(data)
    }

    return (
        <>
            <h1>Welcome back, </h1>
        </>
    )
}

export default Dashboard