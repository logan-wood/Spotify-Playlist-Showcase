import { User } from "../@types/user";

export const getLoggedInUser = (setUser: React.Dispatch<User | null>, setError: React.Dispatch<string>, setIsLoading: React.Dispatch<boolean>) => {
    try {
        setUser(JSON.parse(localStorage.getItem('user') as string));
    } catch {
        setError('There was an error loading your profile.');
    }

    setIsLoading(false);
}

export const isUserLoggedIn = (setUser: React.Dispatch<User | null>, setError: React.Dispatch<string>, setIsLoading: React.Dispatch<boolean>) => {
    const userString = localStorage.getItem('user');

        if (userString) {
            const parsedUser: User = JSON.parse(userString)
            setUser(parsedUser)
        } else {
            setError('There was an error checking if the user is logged in.')
        }

        setIsLoading(false);
}