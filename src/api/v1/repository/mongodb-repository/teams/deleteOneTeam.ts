/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { teamsCollection } from './teamsCollection';

export async function deleteOneTeam(id: string): Promise<number> {
  if (id && !ObjectId.isValid(id)) {
    return 0;
  }

  const result = await teamsCollection.deleteOne({ _id: new ObjectId(id) });

  if (!result.acknowledged) {
    throw new Error('Error deleting team');
  }

  return result.deletedCount;
}
