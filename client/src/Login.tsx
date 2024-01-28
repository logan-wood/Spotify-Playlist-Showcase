import { useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { User } from "./@types/user";

function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        const getCurrentUser = async () => {
            // user is redirected here after server authentication flow. Get user from server, and set neccesary session information
            await fetch(process.env.REACT_APP_SERVER_DOMAIN + '/users/fromCookie')
            .then(async response => await response.json())
            .then((response) => {
                const currentUser: User = {
                    username: response.username
                } 

                localStorage.setItem('user', JSON.stringify(currentUser));
                console.log(localStorage.getItem('user'));

                // redirect to dashboard
                navigate('/dashboard');
            })
            .catch((error) => {
                setError('There was an error loading your profile. Please try again later.');
                console.error('Error loading account data: ' + error);

                navigate('/');
            });
        }

        getCurrentUser();
    }, [])

    return(
        <h1>loading...</h1>
    )
}

export default Login;

function setError(arg0: string) {
    throw new Error("Function not implemented.");
}
