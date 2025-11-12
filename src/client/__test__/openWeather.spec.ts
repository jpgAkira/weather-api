import openWeatherRawResponse from "@test/fixtures/openWeatherRawResponse.json";
import openWeatherNormalizedResponse from "@test/fixtures/openWeatherNormalizeResponse.json";
import { langParams, OpenWeather, unitsParameter } from "../openWeather";
import { AxiosStatic } from "axios";

describe("OpenWeather Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return normalized forecast from OpenWeather service", async () => {
    const cityName = "London";
    const mockGet = vi.fn().mockResolvedValue({ data: openWeatherRawResponse });
    const mockAxios = { get: mockGet } as unknown as AxiosStatic;

    const weather = await new OpenWeather(mockAxios).fetchWeather(
      cityName,
      langParams["pt-br"],
      unitsParameter.celsius
    );

    expect(weather).toEqual(openWeatherNormalizedResponse);
  });
});
