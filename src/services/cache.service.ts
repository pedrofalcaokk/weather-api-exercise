import { createClient } from 'redis';
import { REDIS_DEFAULT_EXPIRE_VALUE } from '../utils/constants';

export class CacheService {
    private static instance: CacheService;
    private redisClient: ReturnType<typeof createClient>;
    private constructor() {
        this.redisClient = createClient({
            url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
            socket: {
                reconnectStrategy: retries => {
                    // Generate a random jitter between 0 – 200 ms:
                    const jitter = Math.floor(Math.random() * 200);
                    // Delay is an exponential back off, (times^2) * 1000 ms, with a maximum value of 10000 ms:
                    const delay = Math.min(Math.pow(2, retries) * 1000, 10000);

                    return delay + jitter;
                }
            }
        });

        this.redisClient.on('error', async (error) => {
            console.log('Redis connection error:', error);
            await this.connect();
        });

        this.connect();
    }

    /**
     * Retrieves the instance of the service
     * 
     * @returns CacheService
     */
    public static getInstance(): CacheService {
        if (!CacheService.instance) {
            CacheService.instance = new CacheService();
        }

        return CacheService.instance;
    }

    /**
     * Disconnects the service from the Redis instance
     */
    public async disconnect(): Promise<void> {
        if (this.redisClient.isOpen) {
            await this.redisClient.disconnect();
        }
    }

    /**
     * Adds a new value to the cache
     * @param key The key used to identify the object stored
     * @param value The value object to be stored
     */
    public async set<T>(key: string, value: T, expire: number = REDIS_DEFAULT_EXPIRE_VALUE): Promise<void> {
        if (expire <= 0 || !Number.isInteger(expire)) {
            throw new Error('Expiration time must be a positive integer');
        }

        if (this.redisClient.isOpen) {
            await this.redisClient.set(key, JSON.stringify(value), {
                EX: expire,
                NX: true,
            });
        }
    }

    /**
     * Retrieves the weather information for a particular location
     * @param key The key used to identify the object stored
     * 
     * @returns Promise<T | null>
     */
    public async get<T>(key: string): Promise<T | null> {
        if (this.redisClient.isOpen) {
            const value = await this.redisClient.get(key);
            return value ? JSON.parse(value) as T : null;
        }

        return null;
    }

    /**
     * Connects the service to the Redis instance
     */
    private async connect(): Promise<void> {
        if (!this.redisClient.isOpen) {
            await this.redisClient.connect();
            console.log('Successfully connected to Redis');
        }
    }
}
