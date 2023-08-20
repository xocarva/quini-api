/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { teamsCollection } from './teamsCollection';

export async function deleteOneTeam(id: string): Promise<number> {
  const deletedCountWhenInvalidId = 0;
  let _id: ObjectId;

  try {
    _id = new ObjectId(id); 
  } catch (error) {
    return deletedCountWhenInvalidId;
  }

  const result = await teamsCollection.deleteOne({ _id });

  if (!result.acknowledged) {
    throw new Error('Error deleting team');
  }

  return result.deletedCount;
}
