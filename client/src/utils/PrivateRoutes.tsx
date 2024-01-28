import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { User } from '../@types/user';
import { isUserLoggedIn } from './userUtils';

const PrivateRoutes = () => {
    const [error, setError] = useState<string>('');
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // set user object if not null
    useEffect(() => {
        isUserLoggedIn(setUser, setError, setIsLoading)
    }, [])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>{error}</div>
    }

    return ( user ? <Outlet /> : <Navigate to="/" />)
}

export default PrivateRoutes;