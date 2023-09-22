import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { BaseError } from '../errors';
import { ErrorResponse } from '../interfaces';

const { NODE_ENV } = process.env;

function handleZodError(err: ZodError, res: Response<ErrorResponse>) {
  const [error]: [{ message: string, path: string }] = JSON.parse(err.toString());
  const msg = `${error.path}: ${error.message}`;
  const stack = err.stack;
  const response = NODE_ENV === 'development' ? { message: msg, stack } : { message: msg };

  res.status(422).json(response);
}

function handleBaseError(err: BaseError, req: Request, res: Response<ErrorResponse>) {
  err.handleResponse(req, res);
}

function handleGenericError(err: Error, res: Response<ErrorResponse>) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const { message, stack } = err;
  const response = NODE_ENV === 'development' ? { message, stack } : { message };

  res.status(statusCode).json(response);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, _next: NextFunction) {
  if (err instanceof ZodError) {
    handleZodError(err, res);
    return;
  }

  if (err instanceof BaseError) {
    handleBaseError(err, req, res);
    return;
  }

  handleGenericError(err, res);
}
