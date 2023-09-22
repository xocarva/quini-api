import * as jwt from 'jsonwebtoken';

const { JWT_EXPIRES_AFTER, JWT_PRIVATE_KEY } = process.env;

interface JWTPayload {
  exp?: number;
  [key: string]: any;
}

export function generateToken<T extends JWTPayload>(payload: T): string {
  const token = jwt.sign({
    exp: Math.floor(Date.now() / 1000) + Number(JWT_EXPIRES_AFTER),
    ...payload,
  }, JWT_PRIVATE_KEY as string);

  return token;
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_PRIVATE_KEY as string);
}
