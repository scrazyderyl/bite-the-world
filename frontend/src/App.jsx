import { useRef, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';

import './App.css'

function App() {

  const mapRef = useRef()
  const mapContainerRef = useRef()

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2VuYmFycmV0dCIsImEiOiJjbTdwNnNjZ3EwazkzMmtwdTUyd245OWZzIn0.kpXLmwdN386GWurljXEuaw'
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11', 
      center: [-74.5, 40], 
      zoom: 9, 
    });

    return () => {
      mapRef.current.remove()
    }
  }, [])

  return (
    <>
     <nav style={styles.nav}>
        <ul style={styles.ul}>
          <li style={styles.li}>
            <a href="/" style={styles.link}>Map</a>
          </li>
          <li style={styles.li}>
            <a href="/map" style={styles.link}>User</a>
          </li>
          <li style={styles.li}>
            <a href="/about" style={styles.link}>Recipes</a>
          </li>
        </ul>
      </nav>

      <div id="map-container" ref={mapContainerRef} style={styles.mapContainer} />
    </>
  )
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
  },
  mapContainer: {
    height: '100vh', 
    width: '100%',
    marginTop: '60px', 
  },
};

export default App