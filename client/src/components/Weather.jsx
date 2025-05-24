import React, { useState } from 'react';
import './weather.css';

import searchIcon from '../assets/search.png';
import cloudIcon from '../assets/cloud.png';
import clearIcon from '../assets/clear.png';
import drizzleIcon from '../assets/drizzle.png';
import rainIcon from '../assets/rain.png';
import snowIcon from '../assets/snow.png';
import windIcon from '../assets/wind.png';

function Weather() {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);

  const allIcon = {
    '01d': clearIcon,
    '01n': clearIcon,
    '02d': cloudIcon,
    '02n': cloudIcon,
    '03d': cloudIcon,
    '03n': cloudIcon,
    '04d': drizzleIcon,
    '04n': drizzleIcon,
    '09d': rainIcon,
    '09n': rainIcon,
    '10d': rainIcon,
    '10n': rainIcon,
    '13d': snowIcon,
    '13n': snowIcon,
  };

  const searchWeather = async (city) => {
    try {
      const url = `http://localhost:3000/weather?city=${city}`;
      const response = await fetch(url);
      const result = await response.json();

      if (!result.weather || !result.weather[0]) {
        throw new Error("Invalid weather data format");
      }

      const icon = allIcon[result.weather[0].icon] || clearIcon;

      setData({
        humidity: result.main.humidity,
        temp: Math.floor(result.main.temp),
        name: result.name,
        windSpeed: result.wind.speed,
        icon: icon
      });

    } catch (error) {
      console.error("Error occurred: ", error.message);
      setData(null);
      alert(`plz enter a valid city name !`)
    }
  };

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search"
          onChange={(e) => setCity(e.target.value)}
        />
        <img src={searchIcon} onClick={() => searchWeather(city)} />
      </div>

      {data ? (
        <>
          <img src={data.icon} alt="weather-icon" className="weather-icon" />
          <p className="temprature">{data.temp}°C</p>
          <p className="location">{data.name}</p>

          <div className="weather-data">
            <div className="col">
              <img src={data.icon} alt="" />
              <div>
                <p>{data.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={windIcon} alt="" />
              <div>
                <p>{data.windSpeed} Km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p style={{ color: 'gray', marginTop: '2rem' }}>
          Enter a city and click search to get weather
        </p>
      )}
    </div>
  );
}

export default Weather;
