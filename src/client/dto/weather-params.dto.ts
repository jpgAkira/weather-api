export const langParams = {
  br: 'pt_br',
  en: 'en',
} as const;

export const unitsParams = {
  fahrenheit: 'imperial',
  celsius: 'metric',
} as const;

export type LangParamKey = keyof typeof langParams;
export type UnitsParamKey = keyof typeof unitsParams;

export type LangParamValue = (typeof langParams)[LangParamKey];
export type UnitsParamValue = (typeof unitsParams)[UnitsParamKey];

export class OpenWeatherOptionsDto {
  langParam: LangParamValue;
  units: UnitsParamValue;
}
