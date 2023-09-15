/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { betsCollection } from './betsCollection';

export async function deleteOneBet(id: string): Promise<number> {
  if (id && !ObjectId.isValid(id)) {
    return 0;
  }

  const result = await betsCollection.deleteOne({ _id: new ObjectId(id) });

  if (!result.acknowledged) {
    throw new Error('Error deleting bet');
  }

  return result.deletedCount;
}
