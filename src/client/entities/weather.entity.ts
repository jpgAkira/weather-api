import { UnitsParamValue } from '../dto/weather-params.dto.js';

export class Weather {
  city: string;
  coords: { lat: number; lng: number };
  weather: { main: string; description: string; icon: string };
  temperature: {
    degrees: UnitsParamValue;
    current: number;
    feels_like: number;
    min: number;
    max: number;
    humidity: number;
  };
  wind: { speed: number; deg: number };
  visibility: number;
  rain?: number;
  snow?: number;
  clouds: number;
  dt: string;
  timezone?: number;
  sys: {
    sunrise: string;
    sunset: string;
  };
}
