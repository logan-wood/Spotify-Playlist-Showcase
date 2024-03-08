import Nav from "./components/Navigation";

function About() {
    return (
        <div>
            <Nav isUserLoggedIn={false} />
            <h1>Spotify Playlist Presenter</h1>
            <p>App under development. In early prototypes, but the app can still play music and display your playlists.</p>
            <p>Github Repo: <a href='https://github.com/logan-wood/Spotify-Playlist-Showcase'>here</a></p>
            <p>Check out my <a href='https://www.loganwood.dev'>portfolio website</a></p>
        </div>
    )
}

export default About;