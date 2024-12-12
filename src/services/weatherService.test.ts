import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import axios from "axios";

import { VisualCrossingApiResponse, Weather } from '../types/weather.types';
import { HttpError } from '../utils/errors';
import { WeatherService } from './weatherService';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
let mockWeatherData: Weather,
    mockExternalResponse: VisualCrossingApiResponse;

describe('Weather Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedAxios.isAxiosError.mockReturnValue(false);

        mockWeatherData = {
            "latitude": 20.5516,
            "longitude": -20.42915,
            "description": "Partly cloudy throughout the day.",
            "maxTemperature": 13.2,
            "minTemperature": 4.6,
            "humidity": 59.2,
            "conditions": "Partially cloudy",
            "sunrise": "07:50:39",
            "sunset": "17:03:44"
        };

        mockExternalResponse = {
            latitude: 20.5516,
            longitude: -20.42915,
            address: 'Braga',
            timezone: 'Lisbon',
            days: [
                {
                    datetime: new Date().toISOString().split('T')[0],
                    tempmax: 13.2,
                    tempmin: 4.6,
                    humidity: 59.2,
                    conditions: "Partially cloudy",
                    description: "Partly cloudy throughout the day.",
                    sunrise: "07:50:39",
                    sunset: "17:03:44"
                }
            ]
        }
    });

    it('Should return an instance of WeatherService when getInstance is called', () => {
        expect(WeatherService.getInstance()).toBeInstanceOf(WeatherService);
    });

    it('Should return weather data when a proper location is provided', async () => {
        // Mock the response for the external API call
        mockedAxios.get.mockResolvedValue({
            data: mockExternalResponse
        });

        // Get the response from the weather service
        const result = await WeatherService.getInstance().getLocationWeatherData('London');

        expect(result).toEqual(mockWeatherData);
    });

    it('Should return the error code from the external api upon failure if available', async () => {
        // Mock axios to throw an error
        const error = {
            isAxiosError: true,
            response: {
                status: 400
            }
        };
        Object.setPrototypeOf(error, Error.prototype);
        mockedAxios.isAxiosError.mockReturnValue(true);
        mockedAxios.get.mockRejectedValue(error);

        await expect(WeatherService.getInstance().getLocationWeatherData('NonExistentCity'))
            .rejects
            .toThrow(new HttpError(400, 'Failed to retrieve weather information', 'WeatherService'));
    });

    it('Should return 500 as the error code when not provided by axios', async () => {
        // Mock axios to throw an error
        const error = {
            isAxiosError: true
        };
        Object.setPrototypeOf(error, Error.prototype);
        mockedAxios.isAxiosError.mockReturnValue(true);
        mockedAxios.get.mockRejectedValue(error);

        await expect(WeatherService.getInstance().getLocationWeatherData('NonExistentCity'))
            .rejects
            .toThrow(new HttpError(500, 'Failed to retrieve weather information', 'WeatherService'));
    });

    it('Should return 500 as the error code when data for today is not available', async () => {
        // change mock data to an impossible date
        mockExternalResponse = {
            latitude: 20.5516,
            longitude: -20.42915,
            address: 'Braga',
            timezone: 'Lisbon',
            days: [
                {
                    datetime: '0001-01-01',
                    tempmax: 13.2,
                    tempmin: 4.6,
                    humidity: 59.2,
                    conditions: "Partially cloudy",
                    description: "Partly cloudy throughout the day.",
                    sunrise: "07:50:39",
                    sunset: "17:03:44"
                }
            ]
        }

        // Mock the response for the external API call
        mockedAxios.get.mockResolvedValue({
            data: mockExternalResponse
        });

        // Get the response from the weather service
        await expect(WeatherService.getInstance().getLocationWeatherData('London'))
            .rejects
            .toThrow(new HttpError(500, 'Weather data is unavailable', 'WeatherService'));
    });

    it('Should return the error code from the external api upon failure if available', async () => {
        // Mock axios to throw an error
        mockedAxios.get.mockImplementation(() => {
            throw new Error('Unexpected error');
        });
        mockedAxios.isAxiosError.mockReturnValue(false);

        await expect(WeatherService.getInstance().getLocationWeatherData('NonExistentCity'))
            .rejects
            .toThrow(new HttpError(500, 'Internal Server Error', 'WeatherService'));
    });
});
