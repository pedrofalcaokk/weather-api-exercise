import axios from "axios";

import { VisualCrossingApiDay, VisualCrossingApiResponse, Weather } from "../types/weather.types";
import { HttpError } from "../utils/errors";
import { CacheService } from "./cache.service";

export class WeatherService {
    private static instance: WeatherService;
    private readonly apiConfig = {
        unitGroup: 'metric',
        include: 'days',
        contentType: 'json'
    };

    private constructor() { }

    /**
     * Retrieves the instance of the service
     * 
     * @returns WeatherService
     */
    public static getInstance(): WeatherService {
        if (!WeatherService.instance) {
            WeatherService.instance = new WeatherService();
        }

        return WeatherService.instance;
    }

    /**
     * Retrieves the weather information for a particular location
     * @param location The location to retrieve weather information to
     * 
     * @returns Promise<Weather>
     */
    public async getLocationWeatherData(location: string): Promise<Weather> {
        try {
            const storedValue = await CacheService.getInstance().get<Weather>(location);
            return storedValue ?? await this.getExternalWeatherData(location);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new HttpError(error.response?.status || 500, 'Failed to retrieve weather information', 'WeatherService');
            } else if (error instanceof HttpError) {
                throw error;
            }

            throw new HttpError(500, 'Internal Server Error', 'WeatherService');
        }
    }

    /**
     * Retrieves the weather information for a particular location from an external API
     * @param location The location to retrieve weather information to
     * 
     * @returns Promise<Weather>
     */
    private async getExternalWeatherData(location: string): Promise<Weather> {
        const params: URLSearchParams = new URLSearchParams({
            unitGroup: this.apiConfig.unitGroup,
            include: this.apiConfig.include,
            key: process.env.VISUAL_CROSSING_API_KEY!,
            contentType: this.apiConfig.contentType
        }),
            address = `${process.env.VISUAL_CROSSING_API_URL}/${location}?${params}`,
            response = await axios.get<VisualCrossingApiResponse>(address),
            currentDay: VisualCrossingApiDay | null = response.data.days.find((day) => day.datetime === new Date().toISOString().split('T')[0]) ?? null;

        if (!currentDay) {
            throw new HttpError(500, "Weather data is unavailable", 'WeatherService');
        }

        const weatherData: Weather = {
            latitude: response.data.latitude,
            longitude: response.data.longitude,
            description: currentDay.description,
            maxTemperature: currentDay.tempmax,
            minTemperature: currentDay.tempmin,
            humidity: currentDay.humidity,
            conditions: currentDay.conditions,
            sunrise: currentDay.sunrise,
            sunset: currentDay.sunset
        }

        try {
            await CacheService.getInstance().set<Weather>(location, weatherData, this.getSecondsUntilMidnight());
        } catch (error) {
            console.log('Error encountered when trying to save weather to cache: ', error);
        }

        return weatherData;
    }

    private getSecondsUntilMidnight(): number {
        const now = new Date()
        const midnight = new Date(now)
        midnight.setHours(24, 0, 0, 0)

        return Math.floor((midnight.getTime() - now.getTime()) / 1000)
    }
}
