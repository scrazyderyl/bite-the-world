import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'

import 'mapbox-gl/dist/mapbox-gl.css';

import './App.css'

function App() {

  const [countryname, setCountryname] = useState(null);
  const mapRef = useRef()
  const mapContainerRef = useRef()

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
    mapboxgl.accessToken = 'pk.eyJ1Ijoia2VuYmFycmV0dCIsImEiOiJjbTdwNnNjZ3EwazkzMmtwdTUyd245OWZzIn0.kpXLmwdN386GWurljXEuaw'
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
      mapRef.current.remove();
      mapRef.current.off('click');
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
            { countryname ? <a href="/about" style={styles.link}>Recipes for {countryname}</a> : null}
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