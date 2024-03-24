import { useEffect } from 'react';
import '../styles/navigation.scss'
import { Link, useNavigate } from 'react-router-dom';

const Nav = (props: {isUserLoggedIn: boolean}) => {
    const navigate = useNavigate();

    const Logout = () => {
        localStorage.removeItem('user');
        navigate('/');
    }

    return (
        <nav>
            <h4>Showcaser</h4>
            <div>
                <button onClick={() => navigate('/about')}>About</button>
                {props.isUserLoggedIn && (
                <>
                    <button onClick={Logout}>Log Out</button>
                    <button onClick={() => { navigate('/dashboard') }}>Dashboard</button>
                </>
                
                )}
            </div>
        </nav>
    );
};

export default Nav;