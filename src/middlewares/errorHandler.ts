import { NextFunction, Request, Response } from "express";

import { HttpError } from "../utils/errors";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
    if (error instanceof HttpError) {
        res.status(error.statusCode).json({
            status: 'Error',
            message: error.message,
        });
        return;
    }

    res.status(500).json({
        status: 'Error',
        message: 'Internal Server Error',
    });

    return;
};
