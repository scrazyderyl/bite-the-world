import { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router'
import mapboxgl from 'mapbox-gl';

function map() {
    const navigate = useNavigate();

    const mapRef = useRef();
    const mapContainerRef = useRef();
  
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
        mapboxgl.accessToken = 'pk.eyJ1Ijoia2VuYmFycmV0dCIsImEiOiJjbTdwNnNjZ3EwazkzMmtwdTUyd245OWZzIn0.kpXLmwdN386GWurljXEuaw';
        mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/kenbarrett/cm84ln2qt005l01qid128djhw',
        center: [5, 10],
        zoom: 1.5
        });
        
        mapRef.current.on('click', async (event) => {
            const { lng, lat } = event.lngLat; // Get clicked coordinates
            var countrydata = await fetchCountry(lng, lat);
            const country_code = countrydata.features[0].properties.context.country.country_code;
            navigate(`/country/${country_code}`);
        });
    
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    });

    return <div id="map-container" ref={mapContainerRef}/>
}

export default map;