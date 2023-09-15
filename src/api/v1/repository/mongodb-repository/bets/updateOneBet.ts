import { ObjectId } from 'mongodb';
import { PartialBet } from '../../../models';
import { betsCollection } from './betsCollection';

export async function updateOneBet(id: string, betData: PartialBet): Promise<number> {
  const result = await betsCollection.updateOne({ _id: new ObjectId(id) }, { $set: betData });

  if (!result.acknowledged) throw new Error('Error updating bet');

  return result.modifiedCount;
}
