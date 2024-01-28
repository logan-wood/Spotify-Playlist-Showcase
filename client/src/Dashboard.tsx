import { useEffect, useState } from "react"
import { User } from "./@types/user";
import ErrorComponent from "./components/ErrorComponent";
import './styles/dashboard.scss';
import Nav from "./components/Navigation";

function Dashboard() {
    // state variables
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<Boolean>(true)
    const [user, setUser] = useState<User>();

    useEffect(() => {
        try {
            setUser(JSON.parse(localStorage.getItem('user') as string));
        } catch {
            setError('There was an error loading your profile.');
        }
        console.log('Dashboard(): ' + user?.username);

        setIsLoading(false);
    }, [])
    
    return (
        <>
            {/* Check if page is loading or if there is an error */}
            {isLoading && <h1>Loading...</h1>}
            {error && <ErrorComponent error={error} />}
            {!isLoading && (
                // page content
                <div className="dashboard">
                    <Nav />
                    <h1>Welcome back, {user?.username}</h1>
                </div>
            )}
        </>
    )
        
    
}

export default Dashboard