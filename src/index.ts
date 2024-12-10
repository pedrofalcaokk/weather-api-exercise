import app from "./app";
import dotenv from "dotenv";

// Load local environment variables
dotenv.config();

const port = process.env.API_PORT;

app.listen(port, () => {
    console.log(`Application listening on port ${port}`);
})
