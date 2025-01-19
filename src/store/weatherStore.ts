import { create } from 'zustand';

interface WeatherState {
  weather: any;
  isHistorical: boolean;
  cityName: string;
  selectedLocation: { latitude: number; longitude: number } | null;
  showForecast: boolean; // Добавлено
  setWeather: (weather: any) => void;
  setIsHistorical: (isHistorical: boolean) => void;
  setCityName: (cityName: string) => void;
  setSelectedLocation: (location: { latitude: number; longitude: number } | null) => void;
  setShowForecast: (show: boolean) => void; // Добавлено
}

const useWeatherStore = create<WeatherState>((set) => ({
  weather: null,
  isHistorical: false,
  cityName: '',
  selectedLocation: null,
  showForecast: false, // Добавлено

  setWeather: (weather) => set({ weather }),
  setIsHistorical: (isHistorical) => set({ isHistorical }),
  setCityName: (cityName) => set({ cityName }),
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  setShowForecast: (show) => set({ showForecast: show }), // Добавлено
}));

export default useWeatherStore;