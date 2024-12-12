import { NextFunction, Request, Response } from 'express';

import { WeatherService } from "../services/weatherService";
import { HttpError } from "../utils/errors";

export async function getLocationWeather(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        // validate the request
        if (!req.params.location) {
            throw new HttpError(400, 'Invalid location', 'WeatherService');
        }

        const weatherData = await WeatherService.getInstance().getLocationWeatherData(req.params.location);
        res.json(weatherData);
    } catch (error) {
        next(error);
    }
}
