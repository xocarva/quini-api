import { NextFunction, Request, Response } from 'express';
import { authService } from '../../services';
import { User, userSchema } from '../../schemas';

export async function login(req: Request<User>, res: Response, next: NextFunction) {
  const { body } = req;
  
  try {
    const user = userSchema.parse(body);
    const token = await authService.login(user);

    res.status(200);
    res.send({ token });
  
  } catch (error) {
    next(error);
    return;
  }
}
