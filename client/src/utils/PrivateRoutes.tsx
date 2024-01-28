import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { User } from '../@types/user';

const PrivateRoutes = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // set user object if not null
    useEffect(() => {
        const userString = localStorage.getItem('user');

        if (userString) {
            const parsedUser: User = JSON.parse(userString)
            setUser(parsedUser)
            
            console.log('PrivateRoutes(): user logged in, ' + parsedUser.username)
        } else {
            console.log('PrivateRoutes(): user not logged in, redirecting to homepage');
        }

        setLoading(false);
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return ( user ? <Outlet /> : <Navigate to="/" />)
}

export default PrivateRoutes;