import "./weather.css";
import search_icon from "../assets/search.png";
import humidity_icon from "../assets/humidity.png";
import wind_icon from "../assets/wind.png";
import { useEffect, useRef, useState } from "react";

const Weather = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [weatherData, setWeatherData] = useState<null | {
    humidity: number;
    wind: number;
    temperature: number;
    location: string;
    icon: string;
  }>(null);

  const getWeatherIconUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const search = async (city: string) => {
    if (!city) {
      alert("Please enter a city name.");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;

      const response = await fetch(url);
      if (!response.ok) {
        alert("City not found. Please try again.");
        return;
      }

      const data = await response.json();
      console.log(data);

      const iconUrl = getWeatherIconUrl(data.weather[0].icon);

      setWeatherData({
        humidity: data.main.humidity,
        wind: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: iconUrl,
      });
    } catch (error) {
      console.error(error);
      alert(
        "There was an error retrieving the weather data. Please try again later."
      );
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputRef.current) {
      search(inputRef.current.value);
    }
  };

  useEffect(() => {
    search("Toronto");
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          onKeyDown={handleKeyDown}
        />
        <img
          src={search_icon}
          alt="Search"
          onClick={() => {
            if (inputRef.current) {
              search(inputRef.current.value);
            }
          }}
        />
      </div>
      {weatherData ? (
        <>
          <img
            src={weatherData.icon}
            alt="Weather Icon"
            className="weather-icon"
          />
          <p className="temperature">{weatherData.temperature}°C</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="Humidity" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="Wind Speed" />
              <div>
                <p>{weatherData.wind} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Weather;
