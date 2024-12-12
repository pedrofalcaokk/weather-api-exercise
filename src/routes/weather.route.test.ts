import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import express, { Application } from 'express';
import request from 'supertest';

import { WeatherService } from '../services/weatherService';
import { Weather } from '../types/weather.types';
import weatherRouter from './weather.route';

describe('Weather Routes', () => {
    const app: Application = express();
    app.use('/weather', weatherRouter);

    beforeAll(() => {
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
    });

    it('Should have a GET endpoint for /:location', async () => {
        const response = await request(app).get('/weather/Lisbon');
        expect(response.status).not.toBe(404);
    });

    it('The GET endpoint should work for different locations', async () => {
        const locations = ['London', 'Paris', 'New-York'];

        for (const location of locations) {
            const response = await request(app).get(`/weather/${location}`);
            expect(response.status).not.toBe(404);
        }
    });
});
