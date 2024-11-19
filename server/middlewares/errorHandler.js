const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || err.status || 500;
    let message = err.message || 'Internal Server Error';
    let errorDetails = err.details || null;

    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation error';
        errorDetails = err.errors || null;
    } else if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }

    console.error('Error stack:', err.stack);

    if (process.env.NODE_ENV === 'production') {
        errorDetails = undefined;
    }

    res.status(statusCode).json({
        status: 'error',
        message,
        details: errorDetails,
    });
};

export default errorHandler;