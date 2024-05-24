import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import PrivateRoutes from './utils/PrivateRoutes';
import Login from './Login';
import Playlist from './Playlist';
import About from './About';
import PlayPresentation from './components/presentation/PlayPresentation';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Router>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route element={<Dashboard />} path="/dashboard" />
            <Route element={<Playlist />} path='/playlist/:playlist_id' />
            <Route element={<PlayPresentation />} path='/presentation/:presentation_id' />
          </Route>
          <Route element={<About />} path='/about' />
          <Route element={<Login />} path='/login' />
          <Route element={<App />} path="/" />
        </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
