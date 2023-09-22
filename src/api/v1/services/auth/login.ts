import { getUser } from '../../repository';
import { generateToken, verifyPassword } from '../../../../utils';
import { DatabaseError, NotFoundError, UnauthorizedError } from '../../../../errors';
import { User, UserWithId } from '../../schemas';

export async function login(credentials: User): Promise<string> {
  let user: UserWithId | null;

  try {
    user = await getUser({ email: credentials.email });
  
  } catch (error) {
    throw new DatabaseError('Error getting user');
  }

  if (!user) {
    throw new NotFoundError('User not found');
  }

  const isPasswordOk = await verifyPassword(credentials.password, user.password);

  if (!isPasswordOk) {
    throw new UnauthorizedError('Invalid credentials');
  }

  return generateToken({ user: { id: user.id } });
}
