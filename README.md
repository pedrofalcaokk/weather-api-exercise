# Weather API

This repository contains a solution for the weather api challenge given by [roadmap.sh](https://roadmap.sh/projects/weather-api-wrapper-service).

## Description

A Node.js/Express API that fetches weather information from a third party API, stores it in cache (PENDING DEVELOPMENT), and provides endpoints to access said information.

## Tech Stack
- Node.js
- Express
- TypeScript
- Jest for unit testing
- Supertest for API testing

## Getting started

1. Install dependencies:
```bash
npm install
```

2. Copy the contents of .env.example into a .env file and fill in the details

3. Start the development server:
```bash
npm start
```

4. Run tests:
```bash
# Regular tests
npm test

# Tests with coverage
npm run test:coverage
```

5. Run Linting:
```bash
npm run lint
```

## API Endpoints

### GET /weather/:location
Returns the weather data for the location provided, if available.

**Route Parameters:**
- `location` (string): Name of the city or location to get weather data for

**Response Fields:**
| Field | Type | Format | Description |
|-------|------|--------|-------------|
| latitude | number | - | Geographic latitude coordinate |
| longitude | number | - | Geographic longitude coordinate |
| description | string | - | Detailed weather description |
| maxTemperature | number | - | Maximum temperature in Celsius |
| minTemperature | number | - | Minimum temperature in Celsius |
| humidity | number | - | Humidity percentage |
| conditions | string | - | Brief weather conditions |
| sunrise | string | HH:mm:ss | Time of sunrise |
| sunset | string | HH:mm:ss | Time of sunset |

## Project Structure
```
backend/
├── src/
│   ├── controllers/ # Controllers for route logic
│   ├── middlewares/ # middlewares to be used by express
│   ├── routes/      # API routes
│   ├── services/    # service layer for business logic
│   └── types/       # Type files
│   ├── utils/       # Utility functions
├── jest.config.js   # Test configuration
└── package.json     # Project dependencies
```
