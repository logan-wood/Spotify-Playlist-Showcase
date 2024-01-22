import spotifyLogo from './images/spotify_logo.png'
import './styles/index.scss'

function App() {
  const spotifyLogin = async () => {
    try {
      console.log('test')
      console.log(process.env.REACT_APP_SERVER_DOMAIN)
      // get spotify login url
      const response = await fetch(process.env.REACT_APP_SERVER_DOMAIN + '/auth')
    
      // get url from response
      const responseData = await response.json()
      console.log(responseData)

      // navigate to spotify login
      window.location.href = responseData
    } catch (error) {
      console.error('An error occured: ' + error)
    }
  }

  return (
    <div className="App">
      <nav>
        <h4>Showcaser</h4>
        <button>About</button>
      </nav>
      
      <section>
        <div className="info">
          <h1>Showcase your playlists</h1>
          <p>Showcaser is the best way to show your playlists to other people. You choose how other people hear your playlists - choose which tracks to show in which order and which snippits to play.</p>
        </div>
        
        <div className="login" onClick={spotifyLogin} >
          <img src={spotifyLogo} className="spotify-logo" alt="Spotify Login"></img>
          <h4>Login With Spotify</h4>
        </div>
      </section>
    </div>
  );
}

export default App;
