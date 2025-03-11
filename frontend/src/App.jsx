import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Login from './Login';
import Signup from './Signup';
import UserHomepage from './UserHomepage';

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

function App() {
  const [countryname, setCountryname] = useState(null);
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const [user, setUser] = useState(null); 
  const [showSignup, setShowSignup] = useState(false); 
  const [currentPage, setCurrentPage] = useState('map'); // current state

  async function fetchCountry(lng, lat) {
    try {
      const response = await fetch(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${mapboxgl.accessToken}`);
      const data = await response.json();
      return data; // Return data for use outside the function
    } catch (error) {
      console.error('Error:', error);
    }
  }

  useEffect(() => {
    if (currentPage === 'map') {
      mapboxgl.accessToken = 'pk.eyJ1Ijoia2VuYmFycmV0dCIsImEiOiJjbTdwNnNjZ3EwazkzMmtwdTUyd245OWZzIn0.kpXLmwdN386GWurljXEuaw';
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/kenbarrett/cm84ln2qt005l01qid128djhw',
        center: [5, 10],
        zoom: 1.5
      });
      
    mapRef.current.on('click', async (event) => {
      const { lng, lat } = event.lngLat; // Get clicked coordinates
      console.log(`Clicked at Longitude: ${lng}, Latitude: ${lat}`);
      let countrydata = await fetchCountry(lng, lat);
      setCountryname(countrydata.features[0].properties.context.country.name);
      console.log(countryname);
      
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
            { countryname ? <button onClick={() => setCurrentPage('recipes')} style={styles.link}>
              Recipes for {countryname}
            </button> : null}
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