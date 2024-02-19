import { useEffect } from 'react';
import '../styles/navigation.scss'
import { Link, useNavigate } from 'react-router-dom';

const Nav = (props: {isUserLoggedIn: boolean}) => {
    const navigate = useNavigate();

    const Logout = () => {
        localStorage.setItem('user', '');
        navigate('/');
    }

    return (
        <nav>
            <h4>Showcaser</h4>
            <div>
                <button>About</button>
                {props.isUserLoggedIn && <button onClick={Logout}>Log Out</button>}
            </div>
        </nav>
    );
};

export default Nav;