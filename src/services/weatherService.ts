import axios from 'axios';

// Запрос прогноза погоды + текущей погоды
export const getWeather = async (lat: number, lon: number) => {
  try {
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        current_weather: true, // ✅ Добавлено для получения текущей погоды
        daily: 'temperature_2m_max,temperature_2m_min,weathercode',
        temperature_unit: 'celsius',
        timezone: 'auto',
      },
    });
    console.log('Weather Data:', response.data); // Лог для проверки
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Запрос исторической погоды
export const getHistoricalWeather = async (lat: number, lon: number, date: string) => {
  try {
    const response = await axios.get('https://archive-api.open-meteo.com/v1/archive', {
      params: {
        latitude: lat,
        longitude: lon,
        start_date: date,
        end_date: date,
        temperature_unit: 'celsius',
        timezone: 'auto',
        daily: 'temperature_2m_max,temperature_2m_min,weathercode',
      },
    });

    console.log('Historical weather data:', response.data);  // Лог для проверки

    return response.data;
  } catch (error) {
    console.error('Error fetching historical weather:', error);
    throw error;
  }
};

// Функция для поиска городов по названию
export const searchCities = async (query: string) => {
  try {
    const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: {
        name: query,
        count: 5,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching city suggestions:', error);
    throw error;
  }
};

// Функция для получения погоды по координатам города
export const getWeatherByCity = async (lat: number, lon: number) => {
  try {
    const response = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: lat,
        longitude: lon,
        current_weather: true, // ✅ Добавлено для текущей погоды
        daily: 'temperature_2m_max,temperature_2m_min,weathercode',
        timezone: 'auto',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};