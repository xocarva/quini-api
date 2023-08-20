import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserWithId } from '../models';

const { JWT_EXPIRES_AFTER, JWT_PRIVATE_KEY, SALT_ROUNDS } = process.env;

export class AuthService {
  static async comparePasswords(password: string, encryptedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, encryptedPassword);
  }

  static async encryptPassword(password: string):  Promise<string> {
    return bcrypt.hash(password, Number(SALT_ROUNDS));
  }

  static generateAuthToken(user: UserWithId): string {
    const { id } = user;
    const payload = { user: { id } };
  
    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + Number(JWT_EXPIRES_AFTER),
      ...payload,
    }, JWT_PRIVATE_KEY as string);
  
    return token;
  }

  static verifyAuthToken(token: string) {
    return jwt.verify(token, JWT_PRIVATE_KEY as string);
  }
}
