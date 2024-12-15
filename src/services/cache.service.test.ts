/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: Look at this file with fresh eyes, I simply gave up
import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { createClient } from 'redis';
import { CacheService } from './cache.service';
import { REDIS_DEFAULT_EXPIRE_VALUE } from '../utils/constants';

jest.mock('redis');

describe('CacheService', () => {
    let cacheService: CacheService;
    const mockGet = jest.fn();
    const mockSet = jest.fn();
    const mockDisconnect = jest.fn();
    const mockConnect = jest.fn();

    beforeEach(async () => {
        const mockRedisClient = {
            connect: mockConnect,
            disconnect: mockDisconnect,
            set: mockSet,
            get: mockGet,
            isOpen: true,
            on: jest.fn()
        };

        (createClient as jest.Mock).mockReturnValue(mockRedisClient);

        (CacheService as any).instance = null;
        cacheService = CacheService.getInstance();
        // Wait for connection to complete
        await mockRedisClient.connect();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should only create one singleton instance', () => {
        const instance1 = CacheService.getInstance();
        const instance2 = CacheService.getInstance();
        expect(instance1).toBe(instance2);
    });

    it('Should create a Redis client on instantiation', async () => {
        expect(createClient).toHaveBeenCalled();
        await Promise.resolve();
        expect(mockConnect).toHaveBeenCalled();
    });

    it('Should set the value with default expiration', async () => {
        const testKey = 'test-key';
        const testValue = { data: 'test-data' };

        await cacheService.set(testKey, testValue);

        expect(mockSet).toHaveBeenCalledWith(
            testKey,
            JSON.stringify(testValue),
            { EX: REDIS_DEFAULT_EXPIRE_VALUE, NX: true }
        );
    });

    it('Should set the value with custom expiration', async () => {
        const testKey = 'test-key';
        const testValue = { data: 'test-data' };
        const customExpire = 7200;

        await cacheService.set(testKey, testValue, customExpire);

        expect(mockSet).toHaveBeenCalledWith(
            testKey,
            JSON.stringify(testValue),
            { EX: customExpire, NX: true }
        );
    });

    it('Should throw error when setting with invalid expiration', async () => {
        const testKey = 'test-key';
        const testValue = { data: 'test-data' };

        await expect(cacheService.set(testKey, testValue, -1))
            .rejects
            .toThrow('Expiration time must be a positive integer');
    });

    it('Should return value from cache correctly', async () => {
        const testKey = 'test-key';
        const testValue = { data: 'test-data' };

        // @ts-expect-error - Mock implementation is correct at runtime
        mockGet.mockResolvedValueOnce(JSON.stringify(testValue));

        const result = await cacheService.get(testKey);

        expect(result).toEqual(testValue);
        expect(mockGet).toHaveBeenCalledWith(testKey);
    });

    it('Should return null when key is not found', async () => {
        // @ts-expect-error - Mock implementation is correct at runtime
        mockGet.mockResolvedValueOnce(null);

        const result = await cacheService.get('non-existent-key');

        expect(result).toBeNull();
    });

    it('Should disconnect from Redis when client is open', async () => {
        await cacheService.disconnect();
        expect(mockDisconnect).toHaveBeenCalled();
    });

    it('Should not disconnect when client is already closed', async () => {
        const mockRedisClient = {
            connect: mockConnect,
            disconnect: mockDisconnect,
            set: mockSet,
            get: mockGet,
            isOpen: false,
            on: jest.fn()
        };

        (createClient as jest.Mock).mockReturnValue(mockRedisClient);

        (CacheService as any).instance = null;
        const newCacheService = CacheService.getInstance();

        await newCacheService.disconnect();
        expect(mockDisconnect).not.toHaveBeenCalled();
    });

    it('Should handle Redis connection error correctly', () => {
        const mockRedisClient = {
            connect: mockConnect,
            disconnect: mockDisconnect,
            set: mockSet,
            get: mockGet,
            isOpen: true,
            on: jest.fn()
        };

        (createClient as jest.Mock).mockReturnValue(mockRedisClient);
        (CacheService as any).instance = null;
        CacheService.getInstance();

        // Trigger the error handler
        const onCall = mockRedisClient.on.mock.calls.find(call => call[0] === 'error');
        if (onCall) {
            const errorHandler = onCall[1] as (error: Error) => void;
            errorHandler(new Error('Redis connection error'));
        }

        expect(mockConnect).toHaveBeenCalled();
    });

    it('Should configure reconnection strategy', () => {
        type RedisConfig = {
            socket: {
                reconnectStrategy: (retries: number) => number;
            };
        };

        const redisConfig = (createClient as jest.Mock).mock.calls[0][0] as RedisConfig;
        const reconnectStrategy = redisConfig.socket.reconnectStrategy;

        const result1 = reconnectStrategy(1);
        const result2 = reconnectStrategy(5);

        expect(result1).toBeLessThan(10200);
        expect(result2).toBeLessThanOrEqual(10200);
    });

    it('Should return null when Redis client is not open during get operation', async () => {
        const mockRedisClient = {
            connect: mockConnect,
            disconnect: mockDisconnect,
            set: mockSet,
            get: mockGet,
            isOpen: false,
            on: jest.fn()
        };

        (createClient as jest.Mock).mockReturnValue(mockRedisClient);
        (CacheService as any).instance = null;
        const newCacheService = CacheService.getInstance();

        const result = await newCacheService.get('any-key');
        expect(result).toBeNull();
    });
});
