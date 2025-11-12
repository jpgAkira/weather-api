import axios from "axios";

export enum langParams {
  "pt-br" = "pt_br",
  "en" = "en",
}

export enum unitsParameter {
  "fahrenheit" = "imperial",
  "celsius" = "metric",
}

export type RawWeatherResponse = {
  readonly weather: [
    {
      readonly main: string;
      readonly description: string;
    }
  ];
  readonly main: {
    readonly temp: number;
    readonly feels_like: number;
    readonly temp_min: number;
    readonly temp_max: number;
    readonly humidity: number;
  };
  readonly visibility: 10000;
  readonly wind: {
    speed: 3.13;
  };
  readonly name: "London";
};

export type Weather = {
  forecast: {
    infos: {
      main: string;
      description: string;
      temperature: {
        degrees: unitsParameter;
        temp: number;
        temp_min: number;
        temp_max: number;
        thermal_sensation: number;
      };
      wind_speed: number;
      humidity: number;
      visibility: number;
    };
  };
};

export class OpenWeather {
  private readonly apiKey = "3512613c7feb3afe8d770f39036672ff";
  private readonly apiUrl = `https://api.openweathermap.org/data/2.5/weather`;

  constructor(private request = axios) {}

  public async fetchWeather(
    cityName: string,
    langParam: langParams,
    units: unitsParameter
  ): Promise<Weather> {
    try {
      const response = await this.request.get(
        `${this.apiUrl}?q=${cityName}&lang=${langParam}&units=${units}&appid=${this.apiKey}`
      );

      return this.normalize(response.data, units);
    } catch (err) {
      console.log(err);
      return;
    }
  }

  private normalize(
    weather: RawWeatherResponse,
    units: unitsParameter
  ): Weather {
    return {
      forecast: {
        infos: {
          main: weather.weather[0].main,
          description: weather.weather[0].description,
          humidity: weather.main.humidity,
          temperature: {
            degrees: units,
            temp: weather.main.temp,
            temp_max: weather.main.temp_max,
            temp_min: weather.main.temp_min,
            thermal_sensation: weather.main.feels_like,
          },
          visibility: weather.visibility,
          wind_speed: weather.wind.speed * 3.6,
        },
      },
    };
  }
}
