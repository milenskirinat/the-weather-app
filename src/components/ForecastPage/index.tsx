import React from 'react';
import WeatherDisplay from '../weatherDisplay';
import useWeatherStore from '@/store/weatherStore';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ForecastPage: React.FC = () => {
  const { weather } = useWeatherStore();

  return (
    <div className="container mx-auto p-8 bg-gradient-to-br from-blue-200 to-purple-300 min-h-screen text-gray-800">
      <h1 className="text-4xl font-extrabold text-center mb-6">
        4-Day Weather Forecast
      </h1>

      <WeatherDisplay weather={weather} isHistorical={false} />

      <div className="flex justify-center mt-6">
        <Link to="/">
          <Button variant="outline" className="py-2 px-4">
            ⬅ Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ForecastPage;