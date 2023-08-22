import React, { useState, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState({ lat: 0, lon: 0 });
  const [mapKey, setMapKey] = useState(0);
  const mapRef = useRef(null);

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=3b72b4f2123220cd65c68b0a267ed12d`;

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios.get(url).then((response) => {
        setData(response.data);
        setCoordinates({ lat: response.data.coord.lat, lon: response.data.coord.lon });
        setMapKey((prevKey) => prevKey + 1); // Increment the mapKey
      });
      setLocation('');
    }
  };

  const renderWeatherInfo = () => {
    if (data.name === undefined) {
      return (
        <div className="intro-message">
          <p>Search for a city to view weather information.</p>
        </div>
      );
    } else {

      return (
        <div className="weather-info">
          <div className="top">
            <div className="location">
              <p>{data.name}</p>
            </div>
            <div className="temp">
              {data.main ? <h1>{data.main.temp.toFixed()}°F</h1> : null}
            </div>
            <div className="description">
              {data.weather ? <p>{data.weather[0].main}</p> : null}
            </div>
          </div>
          <div className="bottom">
            <div className="feels">
              {data.main ? <p className='bold'>{data.main.feels_like.toFixed()}°F</p> : null}
              <p>Feels Like</p>
            </div>
            <div className="humidity">
              {data.main ? <p className='bold'>{data.main.humidity.toFixed()}%</p> : null}
              <p>Humidity</p>
            </div>
            <div className="wind">
              {data.wind ? <p className='bold'>{data.wind.speed.toFixed()} MPH</p> : null}
              <p>Wind Speed</p>
            </div>

          </div>
          {data.coord && (
            <div className="map-container">
              <MapContainer
                key={mapKey}
                center={[coordinates.lat, coordinates.lon]}
                zoom={10}
                style={{ height: '300px', width: '100%', marginTop: '1rem' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[coordinates.lat, coordinates.lon]}>
                  <Popup>{data.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="app">
      <div className="search">
        <input
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          onKeyPress={searchLocation}
          placeholder="Enter Location"
          type="text"
        />
      </div>
      <div className="container">
        {renderWeatherInfo()}
      </div>
    </div>
  );
}

export default App;








