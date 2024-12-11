import express, { Application } from "express";

import weatherRoutes from "./routes/weather.route";
import { errorHandler } from "./middlewares/errorHandler";

const app: Application = express();
app.use(express.json());

app.use('/weather', weatherRoutes);

app.use(errorHandler);

export default app;
