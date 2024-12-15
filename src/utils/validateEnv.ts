export function validationEnvVars() {
    const required: string[] = ['API_PORT', 'VISUAL_CROSSING_API_KEY', 'VISUAL_CROSSING_API_URL'];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
}
