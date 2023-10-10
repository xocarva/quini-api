import { betsCollection } from './betsCollection';
import { Bet, BetWithId } from '../../../schemas';

export async function saveBet(bet: Bet): Promise<BetWithId> {
  const result = await betsCollection.insertOne(bet);
  if (!result.acknowledged) {
    throw new Error('Error saving bet');
  }

  return {
    ...bet,
    id: result.insertedId.toString(),
  };
}
