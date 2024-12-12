import { afterAll, beforeEach, describe, expect, it } from "@jest/globals";

import { validationEnvVars } from "./validateEnv";

describe('Validate environment variables', () => {
    // Store original env vars
    const originalEnv = process.env;

    beforeEach(() => {
        // Clear and reset process.env before each test
        process.env = {
            API_PORT: '3000',
            VISUAL_CROSSING_API_KEY: 'test-key',
            VISUAL_CROSSING_API_URL: 'http://test.com'
        };
    });

    afterAll(() => {
        // Restore original env vars after each test
        process.env = originalEnv;
    });

    it('should not throw error when all required env vars are present', () => {
        expect(() => validationEnvVars()).not.toThrow();
    });

    it('should throw error when one variable is missing', () => {
        delete process.env.API_PORT;
        expect(() => validationEnvVars()).toThrow('Missing required environment variables: API_PORT');
    });

    it('should throw error when several variables are missing', () => {
        delete process.env.API_PORT;
        delete process.env.VISUAL_CROSSING_API_KEY;
        expect(() => validationEnvVars()).toThrow('Missing required environment variables: API_PORT, VISUAL_CROSSING_API_KEY');
    });
});
