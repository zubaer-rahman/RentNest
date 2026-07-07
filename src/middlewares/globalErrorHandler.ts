import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import config from '../config';

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = 'Something went wrong!';
  let errorDetails: { path: string | number; message: string }[] = [
    { path: '', message: 'Something went wrong' },
  ];

  if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation failed';
    errorDetails = err.issues.map((issue) => ({
      path: String(issue.path[issue.path.length - 1] ?? ''),
      message: issue.message,
    }));
  } else if (err?.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
    errorDetails = [{ path: '', message: err.message }];
  } else if (err instanceof Error) {
    message = err.message;
    errorDetails = [{ path: '', message: err.message }];
  }

  res.status(statusCode).json({
    success: false,
    message,
    errorDetails,
  });
};

export default globalErrorHandler;
