import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ErrorResponse } from '../../../interfaces';

const { NODE_ENV } = process.env;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, _req: Request, res: Response<ErrorResponse>, _next: NextFunction) {
  const stack = err.stack;
  
  if (err instanceof ZodError) {
    const [ error ]: [{ message: string, path: string }] = JSON.parse(err.toString()); 
    const { message, path } = error;
    
    const msg = `${path}: ${message}`;

    const response = NODE_ENV === 'development' ? { message: msg, stack } : { message: msg };
    
    res.status(422);
    res.json(response);
    return;
  }
  
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message;
  const response = NODE_ENV === 'development' ? { message, stack } : { message };
  
  res.status(statusCode);
  res.json(response);
}
