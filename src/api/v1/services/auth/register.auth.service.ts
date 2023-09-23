import { getUser, saveUser } from '../../repository';
import { encryptPassword } from '../../../../utils';
import { ConflictError, DatabaseError } from '../../../../errors';
import { User } from '../../schemas';

export async function register(user: User): Promise<string> {
  let userExists: boolean;

  try {
    userExists = !!await getUser({ email: user.email });
  
  } catch (error) {
    throw new DatabaseError('Error checking if user exists');
  }

  if (userExists) {
    throw new ConflictError(`User with email ${user.email} already exists`);
  }

  const encryptedPassword = await encryptPassword(user.password);

  try {
    const { id } = await saveUser({ ...user, password: encryptedPassword });
    return id;
  
  } catch (error) {
    throw new DatabaseError('Error saving user');
  }
}
