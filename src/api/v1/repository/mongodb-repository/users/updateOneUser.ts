import { ObjectId } from 'mongodb';
import { PartialUser } from '../../../models';
import { usersCollection } from './usersCollection';

export async function updateOneUser(id: string, userData: PartialUser): Promise<number> {
  const result = await usersCollection.updateOne({ _id: new ObjectId(id) }, { $set: userData });

  if (result.acknowledged) throw new Error('Error updating user');

  return result.modifiedCount;
}
