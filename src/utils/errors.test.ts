import { describe, expect, it } from "@jest/globals";

import { HttpError } from "./errors";

describe('Http Error', () => {
    it('Should return the error source passed through the constructor in getSource', () => {
        try {
            throw new HttpError(400, 'Bad Request', 'http error test');
        } catch (error) {
            expect(error).toBeInstanceOf(HttpError);
            if (error instanceof HttpError) {
                expect(error.getSource()).toEqual('http error test');
            }
        }
    });
});
