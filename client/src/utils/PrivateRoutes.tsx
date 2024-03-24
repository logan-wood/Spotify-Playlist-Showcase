import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { User } from '../@types/user';
import { getLoggedInUser, isUserLoggedIn } from './userUtils';

const PrivateRoutes = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoggedIn(isUserLoggedIn());
    }, []);

    // will run once isLoading is updated
    useEffect(() => {
        setIsLoading(false);
    }, [isLoggedIn])

    while (isLoading) {
        return <p>Loading...</p>
    }

    return ( isLoggedIn ? <Outlet /> : <Navigate to='/' />)
}

export default PrivateRoutes;