import express, { Application } from "express";
import { rateLimit, RateLimitRequestHandler } from "express-rate-limit";

import { errorHandler } from "./middlewares/errorHandler";
import weatherRoutes from "./routes/weather.route";

const app: Application = express(),
    limiter: RateLimitRequestHandler = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 10, // Limit each ip to 100 request per window
        standardHeaders: 'draft-7',
        legacyHeaders: false,
    });

app.use(express.json());
app.use(limiter);

app.use('/weather', weatherRoutes);

app.use(errorHandler);

export default app;
