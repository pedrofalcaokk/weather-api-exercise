export class HttpError extends Error {
    private source?: string;
    /**
     * Creates a new HTTP Error
     * @param statusCode The HTTP status code for the error (e.g. 400, 404, 500)
     * @param message Detailed error message describing what went wrong
     * @param source Extra information regarding the error
     */
    constructor(public statusCode: number, message: string, source?: string) {
        super(message);
        this.name = this.constructor.name;
        this.source = source;
    }

    public getSource(): string | undefined {
        return this.source;
    }
}
