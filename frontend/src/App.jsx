import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Login from './Login';
import Signup from './Signup';
import UserHomepage from './UserHomepage';

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

function App() {
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const [user, setUser] = useState(null); 
  const [showSignup, setShowSignup] = useState(false); 
  const [currentPage, setCurrentPage] = useState('map'); // current state

  useEffect(() => {
    if (currentPage === 'map') {
      mapboxgl.accessToken = 'pk.eyJ1Ijoia2VuYmFycmV0dCIsImEiOiJjbTdwNnNjZ3EwazkzMmtwdTUyd245OWZzIn0.kpXLmwdN386GWurljXEuaw';
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.5, 40],
        zoom: 1,
      });
  
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
        }
      };
    }
  }, [currentPage]); // make sure page changes on return to Map

  // user login/signin
  const handleLogin = (username, password) => {
    // REPLACE WITH FIREBASE AUTHENTICATION LOGIN
    console.log('Logging in with:', username, password);
    setUser({ username }); //fake simulation
  };

  const handleSignup = (username, password) => {
    // REPLACE WITH FIREBASE AUTHENTICATION LOGIN
    console.log('Signing up with:', username, password);
    setUser({ username }); //fake simulation
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('map'); // go to map page
  };

  return (
    <>
      <nav style={styles.nav}>
        <ul style={styles.ul}>
          <li style={styles.li}>
            <button onClick={() => setCurrentPage('map')} style={styles.link}>
              Map
            </button>
          </li>
          <li style={styles.li}>
            <button onClick={() => setCurrentPage('user')} style={styles.link}>
              User
            </button>
          </li>
          <li style={styles.li}>
            <button onClick={() => setCurrentPage('recipes')} style={styles.link}>
              Recipes
            </button>
          </li>
          {user && (
            <li style={styles.li}>
              <button onClick={handleLogout} style={styles.link}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>

      {currentPage === 'map' && (
        <div id="map-container" ref={mapContainerRef} style={styles.mapContainer} />
      )}

      {currentPage === 'user' && (
        <div style={styles.pageContainer}>
          {user ? (
            <UserHomepage username={user.username} recipes={[]} />
          ) : showSignup ? (
            <Signup onSignup={handleSignup} />
          ) : (
            <Login onLogin={handleLogin} />
          )}
          <button onClick={() => setShowSignup(!showSignup)} style={styles.toggleButton}>
            {showSignup ? 'Back to Login' : 'Create an Account'}
          </button>
        </div>
      )}

      {currentPage === 'recipes' && (
        <div style={styles.pageContainer}>
          <h2>Recipes</h2>
          <p>Your saved recipes will appear here.</p>
        </div>
      )}
    </>
  );
}

const styles = {
  nav: {
    backgroundColor: '#333',
    padding: '10px',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  ul: {
    listStyle: 'none',
    display: 'flex',
    justifyContent: 'center',
    margin: 0,
    padding: 0,
  },
  li: {
    margin: '0 15px',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '18px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  mapContainer: {
    height: '100vh',
    width: '100%',
    marginTop: '60px',
  },
  pageContainer: {
    marginTop: '60px',
    padding: '20px',
  },
  toggleButton: {
    marginTop: '10px',
    padding: '10px',
    fontSize: '16px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default App;