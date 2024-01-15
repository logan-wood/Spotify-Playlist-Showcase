import spotifyLogo from './images/spotify_logo.png'
import './App.css';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const spotifyLogin = () => {
    return navigate("/dashboard")
  }

  return (
    <div className="App">
      <nav>
        <h4>Showcaser</h4>
        <a>About</a>
      </nav>
      
      <section>
        <div className="info">
          <h1>Showcase your playlists</h1>
          <p>Showcaser is the best way to show your playlists to other people. You choose how other people hear your playlists - choose which tracks to show in which order and which snippits to play.</p>
        </div>
        
        <div className="login" onClick={spotifyLogin} >
          <img src={spotifyLogo} className="spotify-logo"></img>
          <h4>Login With Spotify</h4>
        </div>
      </section>
    </div>
  );
}

export default App;
