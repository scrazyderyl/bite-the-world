import { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { auth } from "./firebaseConfig";

import Login from './Login';
import Signup from './Signup';
import UserHomepage from './UserHomepage';
import Country from './Country'

import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

function App() {
  const [loaded, setLoaded] = useState(false);
  const [country, setCountry] = useState(null);
  const mapRef = useRef();
  const mapContainerRef = useRef();
  const [user, setUser] = useState();
  const [showSignup, setShowSignup] = useState(false); 
  const [currentPage, setCurrentPage] = useState('none'); // current state

  async function fetchCountry(lng, lat) {
    try {
      const response = await fetch(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${mapboxgl.accessToken}`);
      const data = await response.json();
      return data; // Return data for use outside the function
    } catch (error) {
      console.error('Error:', error);
    }
  }

  if (!loaded) {
    auth.authStateReady().then(() => {
      setUser(auth.currentUser);
      setLoaded(true);
      setCurrentPage('map');
    });
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
      setCountry(countrydata.features[0].properties.context.country);
      setCurrentPage('country');
      
    });
  
      return () => {
        if (mapRef.current) {
          mapRef.current.remove();
        }
      };
    }
  }, [currentPage]); // make sure page changes on return to Map

  // user login/signin
  const handleLogin = () => {
    setUser(auth.currentUser);
  };

  const handleSignup = () => {
    setUser(auth.currentUser);
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      setUser(null);
      setCurrentPage('map'); // go to map page
    }).catch((error) => {
      console.log("Failed to sign out", error);
    });
  };

  function getPage() {
    switch (currentPage) {
      case "map": return <div id="map-container" ref={mapContainerRef} style={styles.mapContainer} />
      case "user":
        if (user) {
          return <div style={styles.pagePadding}>
            <UserHomepage username={user.displayName} recipes={[]} />
          </div>
        } else if (showSignup) {
          return <div style={styles.pagePadding}>
            <Signup onSignup={handleSignup} />
            <button onClick={() => setShowSignup(false)} style={styles.toggleButton}>
              Back to Login
            </button>
          </div>
        } else {
          return <div style={styles.pagePadding}>
            <Login onLogin={handleLogin} />
            <button onClick={() => setShowSignup(true)} style={styles.toggleButton}>
              Create an Account
            </button>
          </div>
        }
      case "country": return <div style={styles.pagePadding}>
        <Country country={country}/>
      </div>
    }
  }

  return (
    <>
      <nav style={{ ...styles.nav, display: loaded ? 'block' : 'none' }}>
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
          {user && (
            <li style={styles.li}>
              <button onClick={handleLogout} style={styles.link}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>

      <div style={styles.page}>
          {getPage()}
      </div>
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
  page: {
    position: 'absolute',
    paddingTop: '65.59px',
    width: '100%',
    height: 'calc(100% - 65.59px)',
  },
  pagePadding: {
    paddingTop: '20px',
    paddingBottom: '20px',
    paddingLeft: '40px',
    paddingRight: '40px'
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