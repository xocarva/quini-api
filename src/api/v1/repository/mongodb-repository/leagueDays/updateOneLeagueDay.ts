import { ObjectId } from 'mongodb';
import { PartialLeagueDay } from '../../../models';
import { leagueDaysCollection } from './leagueDaysCollection';

export async function updateOneLeagueDay(id: string, leagueDayData: PartialLeagueDay): Promise<number> {
  const result = await leagueDaysCollection.updateOne({ _id: new ObjectId(id) }, { $set: leagueDayData });

  if (!result.acknowledged) throw new Error('Error updating league day');

  return result.modifiedCount;
}
