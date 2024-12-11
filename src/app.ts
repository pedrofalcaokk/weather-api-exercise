import express, { Application } from "express";

import { errorHandler } from "./middlewares/errorHandler";
import weatherRoutes from "./routes/weather.route";

const app: Application = express();
app.use(express.json());

app.use('/weather', weatherRoutes);

app.use(errorHandler);

export default app;
