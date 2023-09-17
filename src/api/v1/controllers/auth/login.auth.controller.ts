import { NextFunction, Request, Response } from 'express';
import { User, UserModel } from '../../models';
import { AuthService } from '../../services';

export async function login(req: Request<User>, res: Response, next: NextFunction) {
  const { body } = req;
  
  try {
    const credentials = UserModel.validateOne(body);
    const user = await UserModel.findOne({ email: credentials.email });

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const isPasswordOk = await AuthService.comparePasswords(
      credentials.password,
      user.password,
    );

    if (!isPasswordOk) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    const token =  AuthService.generateAuthToken(user);

    res.status(200);
    res.send({ token });
  
  } catch (error) {
    next(error);
    return;
  }
}
