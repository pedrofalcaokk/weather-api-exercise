import { Router } from 'express';

import { getLocationWeather } from "../controllers/weather.controller";

const router: Router = Router();

router.get("/:location", getLocationWeather);

export default router;
