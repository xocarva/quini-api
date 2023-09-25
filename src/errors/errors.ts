import { Request, Response } from 'express';

export abstract class BaseError extends Error {
  statusCode: number;
  
  constructor(message: string, name: string, statusCode: number) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  handleResponse(req: Request, res: Response): void {
    const { NODE_ENV } = process.env;
    const stack = this.stack;
    const response = NODE_ENV === 'development'
      ? { message: `${this.message} - ${req.originalUrl}`, stack }
      : { message: this.message };
    
    res.status(this.statusCode);
    res.json(response);
  }
}

export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized access') {
    super(message, 'UnauthorizedError', 401);
  }
}

export class NotFoundError extends BaseError {
  constructor(message = 'Resource not found') {
    super(message, 'NotFoundError', 404);
  }
}

export class ConflictError extends BaseError {
  constructor(message = 'Conflict') {
    super(message, 'ConflictError', 409);
  }
}

export class UnprocessableContentError extends BaseError {
  constructor(message = 'Conflict') {
    super(message, 'ConflictError', 422);
  }
}

export class DatabaseError extends BaseError {
  constructor(message = 'Database error') {
    super(message, 'DatabaseError', 500);
  }
}
