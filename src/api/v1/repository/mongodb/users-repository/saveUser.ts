import { usersCollection } from './usersCollection';
import { User, UserWithId } from '../../../schemas';

export async function saveUser(user: User): Promise<UserWithId> {
  const result = await usersCollection.insertOne(user);

  if (!result.acknowledged) {
    throw new Error();
  }

  return {
    ...user,
    id: result.insertedId.toString(),
  };
}
