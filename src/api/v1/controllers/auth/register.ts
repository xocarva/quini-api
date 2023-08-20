import { NextFunction, Request, Response } from 'express';
import { User, UserModel } from '../../models';
import { AuthService } from '../../services';

export async function register(req: Request<User>, res: Response<{ id: string }>, next: NextFunction) {
  const { body } = req;

  try {
    const user = UserModel.validateOne(body);

    const userExists = !!await UserModel.findOne({ email: user.email });

    if (userExists) {
      res.status(409);
      throw new Error(`User with email ${user.email} already exists`);
    }

    const encryptedPassword = await AuthService.encryptPassword(user.password);

    const { id } = await UserModel.createOne({ ...user, password: encryptedPassword });
    res.status(201).send({ id });
  
  } catch (error) {
    next(error);
    return;
  }
}
