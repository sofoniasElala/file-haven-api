interface HttpError extends Error {
    status?: number;
}

export {HttpError}