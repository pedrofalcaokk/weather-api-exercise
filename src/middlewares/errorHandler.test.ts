import { describe, expect, it } from '@jest/globals';
import express, { Application } from "express";
import request from "supertest";

import { HttpError } from '../utils/errors';
import { errorHandler } from "./errorHandler";

describe('ErrorHandler', () => {
    const app: Application = express();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.get('/testError', (req, res) => {
        throw new Error("this is a regular error");
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.get('/testHttpError', (req, res) => {
        throw new HttpError(400, "this is an http error", 'ErrorHandlerTest');
    })

    app.use(errorHandler);

    it('Should handle regular errors by responding to requests with code 500', async () => {
        const response = await request(app).get('/testError');
        expect(response.status).toEqual(500);
        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual('Error');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('Internal Server Error');
    });

    it('Should handle regular HttpErrors by using its status and message properties', async () => {
        const response = await request(app).get('/testHttpError');
        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty('status');
        expect(response.body.status).toEqual('Error');
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toEqual('this is an http error');
    });
});
