export type Weather = {
    latitude: number;
    longitude: number;
    description: string;
    maxTemperature: number;
    minTemperature: number;
    humidity: number;
    conditions: string;
    sunrise: string;
    sunset: string;
};

export type VisualCrossingApiDay = {
    datetime: string;
    tempmax: number;
    tempmin: number;
    humidity: number;
    conditions: string;
    description: string;
    sunrise: string;
    sunset: string;
}

export type VisualCrossingApiResponse = {
    latitude: number;
    longitude: number;
    address: string;
    timezone: string;
    days: VisualCrossingApiDay[];
}
