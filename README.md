# Weather API

This repository contains a solution for the weather api challenge given by [roadmap.sh](https://roadmap.sh/projects/weather-api-wrapper-service).

[![API CI](https://github.com/pedrofalcaokk/weather-api-exercise/actions/workflows/node.js.yml/badge.svg)](https://github.com/pedrofalcaokk/weather-api-exercise/actions/workflows/node.js.yml)

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

2. [Optional] Start a local redis container with docker-compose

```yaml
services:
  redis:
    image: redis:8.0-M02-alpine
    container_name: redis-container
    ports:
      - "6379:6379"
    command: ["redis-server", "--appendonly", "yes", "--requirepass", "YOUR-PASSWORD"]
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

3. Copy the contents of .env.example into a .env file and fill in the details

4. Start the development server:
```bash
npm start
```

5. Run tests:
```bash
# Regular tests
npm test

# Tests with coverage
npm run test:coverage
```

6. Run Linting:
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
