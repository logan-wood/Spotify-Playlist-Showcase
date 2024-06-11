import Nav from "./components/Navigation";

function About() {
    return (
        <div>
            <Nav isUserLoggedIn={false} />
            <h1>Spotify Playlist Presenter</h1>
            <p>App under development. A working prototype is now available. Users can view their playlists, and create a presentation, with specific timestamps and order or tracks. Presentations can be played on the web app. Styling needs more work, and the application will be buggy.</p>
            <p>Github Repo: <a href='https://github.com/logan-wood/Spotify-Playlist-Showcase'>Click Me</a></p>
            <p>Check out my <a href='https://www.loganwood.dev'>portfolio website</a></p>
        </div>
    )
}

export default About;