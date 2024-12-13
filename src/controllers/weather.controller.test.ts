import { getMockReq, getMockRes } from '@jest-mock/express';
import { describe, expect, it, jest } from '@jest/globals';

import { WeatherService } from '../services/weather.service';
import { Weather } from '../types/weather.types';
import { HttpError } from '../utils/errors';
import { getLocationWeather } from './weather.controller';

describe('WeatherController', () => {
    const mockWeatherServiceResponse: Weather = {
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

    WeatherService.getInstance().getLocationWeatherData = jest.fn(() => new Promise<Weather>((resolve) => resolve(mockWeatherServiceResponse)));

    it('should return weather data for valid location', async () => {
        // Call the controller
        const req = getMockReq({ params: { location: 'London' } }),
            { res, next } = getMockRes();
        await getLocationWeather(req, res, next);

        // Assert the response
        expect(res.json).toHaveBeenCalledWith(mockWeatherServiceResponse);
        expect(next).not.toHaveBeenCalled();
    });

    it('should handle missing location parameter', async () => {
        const mockHttpError = new HttpError(400, 'Invalid location', 'WeatherService');

        // Call the controller
        const req = getMockReq({ params: {} }),
            { res, next } = getMockRes();
        await getLocationWeather(req, res, next);

        // Assert the response
        expect(next).toHaveBeenCalledWith(mockHttpError);
    });
});
