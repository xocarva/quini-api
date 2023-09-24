import { NextFunction, Request, Response } from 'express';
import { authService } from '../../services';
import { User, userSchema } from '../../schemas';

export async function register(req: Request<User>, res: Response<{ id: string }>, next: NextFunction) {
  const { body } = req;

  try {
    const user = userSchema.parse(body);
    const id = await authService.register(user);

    res.status(201);
    res.send({ id });

  } catch (error) {
    next(error);
    return;
  }
}
