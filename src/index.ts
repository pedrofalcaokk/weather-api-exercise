import dotenv from "dotenv";

import app from "./app";
import { validationEnvVars } from "./utils/validateEnv";
import { CacheService } from "./services/cache.service";

// Load local environment variables
dotenv.config();

// Validate that required environment variables are set
validationEnvVars();

// Close cache connection when the application closes
process.on('SIGINT', async () => {
    await CacheService.getInstance().disconnect();
    process.exit();
});

const port = process.env.API_PORT;

app.listen(port, () => {
    console.log(`Application listening on port ${port}`);
})
