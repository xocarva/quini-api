import { Bet, BetWithId } from '../../../models';
import { betsCollection } from './betsCollection';

export async function createOneBet(bet: Bet): Promise<BetWithId> {
  const result = await betsCollection.insertOne(bet);
  if (!result.acknowledged) throw new Error('Error saving bet');

  return {
    ...bet,
    id: result.insertedId.toString(),
  };
}
