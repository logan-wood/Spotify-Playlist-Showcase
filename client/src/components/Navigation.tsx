import { useEffect } from 'react';
import '../styles/navigation.scss'
import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
    const navigate = useNavigate();

    const Logout = () => {
        localStorage.setItem('user', '');

        navigate('/');
    }
    return (
        <nav>
            <h4>Showcaser</h4>
            <Link to='/'>Homepage</Link>
            <button>About</button>
            <button onClick={Logout}>Log Out</button>
        </nav>
    );
};

export default Nav;