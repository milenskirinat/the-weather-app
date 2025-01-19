import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { searchCities, getWeatherByCity } from '@/services/weatherService';
import useWeatherStore from '@/store/weatherStore';
import { toast } from 'react-toastify';

const CitySearch: React.FC = () => {
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 🏙 Сохраняем погоду и выбранный город
  const { setWeather, setCityName, setSelectedLocation } = useWeatherStore();

  // 🔍 Поиск подсказок по вводу
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (city.length >= 3) {
        setIsLoading(true);
        try {
          const results = await searchCities(city);
          setSuggestions(results || []);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300); // ⏳ Задержка 300мс
    return () => clearTimeout(debounceTimer);
  }, [city]);

  // 🌍 Выбор города и загрузка погоды
  const handleSelectCity = async (selectedCity: any) => {
    try {
      const { latitude, longitude, name, country } = selectedCity;

      // ⛅ Загружаем погоду по координатам выбранного города
      const data = await getWeatherByCity(latitude, longitude);
      setWeather(data);

      // ✅ Сохраняем название и координаты города
      setCity(`${name}, ${country}`);
      setCityName(`${name}, ${country}`);
      setSelectedLocation({ latitude, longitude });

      setSuggestions([]);
    } catch (error) {
      toast.error('Error loading weather data');
      console.error('Error fetching weather data:', error);
    }
  };

  return (
    <div className="relative w-64 mx-auto mb-4">
      <Input
        type="text"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full text-gray-800 bg-white"
      />

      {/* 🔽 Подсказки */}
      {isLoading && <p className="text-gray-500 mt-2">Loading...</p>}

      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white w-full border border-gray-300 rounded-md shadow-md max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelectCity(suggestion)}
              className="px-4 text-gray-800 py-2 cursor-pointer hover:bg-gray-200"
            >
              {suggestion.name}, {suggestion.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitySearch;