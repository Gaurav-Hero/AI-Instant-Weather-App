import React,{ useState} from 'react'

import './weather.css'
import searchIcon from '../assets/search.png'
import cloudIcon from '../assets/cloud.png'
import clearIcon from '../assets/clear.png'
import drizzleIcon from '../assets/drizzle.png'
// import humidityIcon from '../assets/humidity.png'
import rainIcon from '../assets/rain.png'
import snowIcon from '../assets/snow.png'
import windIcon from '../assets/wind.png'


function Weather() {
    const [city, setCity] = useState('');
    const [data, setData] = useState(false)
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
        '010d': rainIcon,
        '010n': rainIcon,
        '013d': snowIcon,
        '013n': snowIcon,
    }

    const searchWeather = async(city) => {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_open_weather_secret}`

            const response = await fetch(url)
            const data = await response.json()
            const icon = allIcon[data.weather[0].icon] || clearIcon
            console.log(data)
            setData({
                humidity: data.main.humidity,
                temp: Math.floor(data.main.temp),
                name: data.name,
                windSpeed: data.wind.speed,
                icon: icon

            })

        } catch (error) {
            console.log("Error occured : -> ",error)
        }
    }
    
  return (
    <div className='weather'>
      <div className="search-bar">
        <input 
        type="text" 
        placeholder='Search'
        onChange={(e) => setCity(e.target.value)} />
        <img 
        src={searchIcon} 
        onClick={() => searchWeather(city)} />
      </div>
      <img src={clearIcon} alt="" className='weather-icon'/>
      <p className='temprature'>{data.temp}°C</p>
      <p className='location'>{data.name}</p>
      <div className='weather-data'>
        <div className="col">
            <img src={data.icon} alt="" />
            <div>
                <p>{data.humidity} %</p>
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
    </div>
  )
}

export default Weather
