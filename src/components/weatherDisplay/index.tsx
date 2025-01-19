import React from 'react';
import { getWeatherDescription } from '../../lib/utils';

interface WeatherDay {
  date: Date;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
}

interface WeatherDisplayProps {
  weather: any;
  isHistorical: boolean;
  selectedDate?: string;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather, isHistorical, selectedDate }) => {
  if (!weather) {
    return <p className="text-center text-gray-600">No weather data available.</p>;
  }

  // Получаем название города (если есть)
  const cityName = weather.city?.name || weather.timezone || 'Unknown Location';

  // Историческая погода
  if (isHistorical && weather.current) {
    return (
      <div className="p-4 border rounded-md bg-gray-200 shadow-sm text-gray-700">
        <h2 className="text-xl font-semibold">Weather in {cityName}</h2>
        <p className="font-medium">Date: {selectedDate || 'N/A'}</p>
        <p>Temperature: {weather.current.temp !== 'N/A' ? `${weather.current.temp}°C` : 'No data'}</p>
        <p>Condition: {weather.current.weather[0]?.description || 'N/A'}</p>
      </div>
    );
  }

  // Прогноз на 5 дней (сегодня + 4 дня)
  if (weather.daily) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailyForecast: WeatherDay[] = weather.daily.time
      .map((date: string, index: number): WeatherDay => ({
        date: new Date(date),
        maxTemp: weather.daily.temperature_2m_max[index],
        minTemp: weather.daily.temperature_2m_min[index],
        weatherCode: weather.daily.weathercode[index],
      }))
      .filter((day: WeatherDay) => day.date >= today)
      .slice(0, 5);

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg text-gray-800 space-y-4">
        {/* 🔥 Добавили отображение города */}
        <h2 className="text-xl font-semibold">Weather Forecast in {cityName}</h2>
        
        {dailyForecast.map((day: WeatherDay, index: number) => (
          <div
            key={index}
            className="p-4 border rounded-md bg-gray-200 shadow-sm text-gray-700"
          >
            <p className="font-medium">Date: {day.date.toLocaleDateString()}</p>
            <p>Max Temperature: {day.maxTemp}°C</p>
            <p>Min Temperature: {day.minTemp}°C</p>
            <p>Condition: {getWeatherDescription(day.weatherCode)}</p>
          </div>
        ))}
      </div>
    );
  }

  return <p className="text-center text-gray-600">No data available.</p>;
};

export default WeatherDisplay;