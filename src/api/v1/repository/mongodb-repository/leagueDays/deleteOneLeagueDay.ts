/* eslint-disable @typescript-eslint/naming-convention */
import { ObjectId } from 'mongodb';
import { leagueDaysCollection } from './leagueDaysCollection';

export async function deleteOneLeagueDay(id: string): Promise<number> {
  if (id && !ObjectId.isValid(id)) {
    return 0;
  }

  const result = await leagueDaysCollection.deleteOne({ _id: new ObjectId(id) });

  if (!result.acknowledged) {
    throw new Error('Error deleting league day');
  }

  return result.deletedCount;
}
