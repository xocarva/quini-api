import { User, UserWithId } from '../../../models';
import { usersCollection } from './usersCollection';

export async function createOneUser(user: User): Promise<UserWithId> {
  const result = await usersCollection.insertOne(user);
  if (!result.acknowledged) throw new Error('Error saving user');

  return {
    ...user,
    id: result.insertedId.toString(),
  };
}
