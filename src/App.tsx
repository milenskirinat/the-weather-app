import React, { useEffect, useState } from 'react';
import WeatherDisplay from './components/weatherDisplay';
import useWeatherStore from './store/weatherStore';
import { getCurrentLocation } from './services/geoLocationService';
import { getWeather, getHistoricalWeather } from './services/weatherService';
import DatePicker from './components/DatePicker';
import CitySearch from './components/CitySearch';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import './index.css';
import { Link } from 'react-router-dom';
import { getWeatherDescription } from '@/lib/utils';

const App: React.FC = () => {
  const {
    weather,
    setWeather,
    isHistorical,
    setIsHistorical,
    cityName,
    setCityName,
    selectedLocation,
    setSelectedLocation,
    showForecast,
    setShowForecast,
  } = useWeatherStore();

  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const loc = await getCurrentLocation();
        const { latitude, longitude } = loc.coords;
        setLocation({ latitude, longitude });
        setSelectedLocation({ latitude, longitude });

        const data = await getWeather(latitude, longitude);
        setWeather(data);
        setIsHistorical(false);

        const cityResponse = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const cityData = await cityResponse.json();

        setCityName(cityData.address.city || cityData.address.town || cityData.address.village || 'Unknown Location');
      } catch (error) {
        console.error('Error fetching weather:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [setWeather, setCityName, setSelectedLocation]);

  const handleDateChange = async () => {
    const locToUse = selectedLocation || location;

    if (locToUse && selectedDate) {
      try {
        const { latitude, longitude } = locToUse;
        const formattedDate = selectedDate.toLocaleDateString('en-CA');

        const data = await getHistoricalWeather(latitude, longitude, formattedDate);

        if (data && data.daily && data.daily.temperature_2m_max?.length > 0) {
          setWeather({
            current: {
              dt: new Date(selectedDate).getTime() / 1000,
              temp: data.daily.temperature_2m_max[0],
              weather: [
                {
                  description: 'Clear sky',
                },
              ],
            },
          });
        } else {
          console.error('No temperature data available for the selected date.');
        }

        setIsHistorical(true);
        setShowForecast(false);
      } catch (error) {
        console.error('Error fetching historical weather:', error);
      }
    }
  };

  const resetToForecast = () => {
    setIsHistorical(false);
    setIsLoading(true);

    const fetchWeather = async () => {
      const locToUse = selectedLocation || location;

      if (locToUse) {
        const { latitude, longitude } = locToUse;
        const data = await getWeather(latitude, longitude);
        setWeather(data);
        setIsLoading(false);
      }
    };

    fetchWeather();
  };

  return (
    <div className="container mx-auto py-8 px-4 bg-gradient-to-br from-blue-200 to-purple-300 min-h-screen text-gray-800">
      {/* 🌍 Название города */}
      <h1 className="text-5xl font-extrabold text-center mb-6 text-gray-900">
        {cityName ? `${cityName} Weather` : 'Loading...'}
      </h1>

      {/* 🔍 Поиск города */}
      <div className="flex justify-center mb-8">
        <CitySearch />
      </div>

     {/* 🌡️ Блок текущей температуры */}
     {weather && weather.current_weather ? (
       <div className="text-center my-8">
         <h2 className="text-6xl font-bold text-gray-900">
           {Math.round(weather.current_weather.temperature)}°C
         </h2>
         <p className="text-2xl text-gray-700 capitalize">
           {getWeatherDescription(weather.current_weather.weathercode)}
         </p>
       </div>
     ) : (
       <p className="text-center text-gray-500">Loading current weather...</p>
     )}

      {/* 📅 Прогноз на сегодня и завтра */}
      {weather && weather.daily && (
        <div className="flex justify-center gap-8 text-lg text-gray-800">
          {/* Сегодня */}
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="font-semibold text-gray-900">Today</h3>
            <p>Max: {Math.round(weather.daily.temperature_2m_max[0])}°C</p>
            <p>Min: {Math.round(weather.daily.temperature_2m_min[0])}°C</p>
          </div>
      
          {/* Завтра */}
          <div className="p-4 bg-white rounded-lg shadow-md">
            <h3 className="font-semibold text-gray-900">Tomorrow</h3>
            <p>Max: {Math.round(weather.daily.temperature_2m_max[1])}°C</p>
            <p>Min: {Math.round(weather.daily.temperature_2m_min[1])}°C</p>
          </div>
        </div>
      )}

      {/* 🔘 Кнопки */}
      <div className="flex justify-center gap-6 mt-6">
        <Link to="/forecast">
          <Button variant="default" className="w-48 py-3 text-lg">
            4-Day Forecast
          </Button>
        </Link>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
              Historical Weather
            </Button>
          </DialogTrigger>

          <DialogContent>
            <h3 className="text-xl font-medium mb-4 text-center">Select a Date</h3>
            <div className="flex flex-col items-center gap-4">
              <DatePicker onDateChange={(date) => setSelectedDate(date)} />
              <Button
                onClick={async () => {
                  await handleDateChange(); // загружаем погоду
                  setIsDialogOpen(false);  // закрываем попап
                }}
                variant="default"
                className="w-full"
                disabled={!selectedDate}
              >
                Show Weather
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 🔄 Кнопка сброса */}
      {isHistorical && (
        <Button
          onClick={resetToForecast}
          className="block mx-auto mt-6 px-6 py-3 bg-blue-600 text-white rounded-md text-lg"
        >
          Show Current Forecast
        </Button>
      )}

      {/* ⏳ Индикатор загрузки или отображение погоды */}
      {isLoading ? (
        <div className="flex justify-center items-center mt-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : showForecast ? (
        <WeatherDisplay weather={weather} isHistorical={false} selectedDate={selectedDate?.toISOString()} />
      ) : (
        isHistorical && <WeatherDisplay weather={weather} isHistorical={true} selectedDate={selectedDate?.toISOString()} />
      )}
    </div>
  );
};

export default App;