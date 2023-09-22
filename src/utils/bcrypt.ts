import * as bcrypt from 'bcrypt';

const { SALT_ROUNDS } = process.env;

export function encryptPassword(data: string | Buffer): Promise<string> {
  return bcrypt.hash(data, Number(SALT_ROUNDS));
}

export function verifyPassword(data: string | Buffer, encrypted: string): Promise<boolean> {
  return bcrypt.compare(data, encrypted);
}
