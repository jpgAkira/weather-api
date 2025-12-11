export class RawWeatherResponse {
  coord: { lon: number; lat: number };
  weather: [{ main: string; description: string; icon: string }];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  visibility: number;
  wind: { speed: number; deg: number };
  rain: { [key: string]: number };
  snow: { [key: string]: number };
  clouds: { all: number };
  dt: number;
  sys: { sunrise: number; sunset: number };
  timezone: number;
  name: string;
}

export class LocalTimes {
  sunrise: string;
  sunset: string;
  dt: string;
}
