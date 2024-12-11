import dotenv from "dotenv";

import app from "./app";
import { validationEnvVars } from "./utils/validateEnv";

// Load local environment variables
dotenv.config();

// Validate that required environment variables are set
validationEnvVars();

const port = process.env.API_PORT;

app.listen(port, () => {
    console.log(`Application listening on port ${port}`);
})
