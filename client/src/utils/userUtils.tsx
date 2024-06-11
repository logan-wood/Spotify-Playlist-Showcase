import { User } from "../@types/user";

/**
 * This function updates the 'user' state in a component by retrieving a user from localStorage. If no user is found, an error is generated???
 * 
 * @param setUser used to update the 'user' state
 * @param setError user to update the 'error' state is an error occurs
 */
export const getLoggedInUser = (setUser: React.Dispatch<User | null>, setError: React.Dispatch<string>): void => {
    const userString = localStorage.getItem('user');

    if (userString) {
        const parsedUser: User = JSON.parse(userString)
        setUser(parsedUser)
    } else {
        setError('There was an error checking if the user is logged in.')
    }
}

export const isUserLoggedIn = (): boolean => {
    const userString = localStorage.getItem('user');

    if (userString != '' && userString != undefined) {
        return true;
    }

    return false;
}